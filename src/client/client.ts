
import type { RawClient, ClientConfig } from "./client.type.js"
import { createPool, type Pool } from 'generic-pool';
import { CommandAPI } from '../wire/command-set.js';
import { TcpClient } from './tcp.client.js';
import { TlsClient } from './tls.client.js';
import { debug } from './client.debug.js';


export const rawClientGetter = (config: ClientConfig): Promise<RawClient> => {
  const { transport, options } = config;
  switch (transport) {
    case 'TCP': return TcpClient(options);
    case 'TLS': return TlsClient(options);
  }
}

// create & destroy must be async
const createPoolFactory = (config: ClientConfig) => ({
  create: function () {
    return rawClientGetter(config);
  },
  destroy: async function (client: RawClient) {
    return client.destroy();
  }
});

export class Client extends CommandAPI {
  _config: ClientConfig
  _pool: Pool<RawClient>

  constructor(config: ClientConfig) {
    const min = config.poolSize?.min || 1;
    const max = config.poolSize?.max || 4;
    const pool = createPool(createPoolFactory(config), { min, max });
    const getFromPool = async () => {
      const c = await pool.acquire();
      if (!c.isAuthenticated)
        await c.authenticate(config.credentials);
      debug('client acquired from pool. POOL SIZE::', pool.size);
      c.once('finishQueue', () => {
        pool.release(c)
        debug('client released to pool ! POOL SIZE::', pool.size);
      });
      return c;
    };
    super(getFromPool);
    this._config = config;
    this._pool = pool;
  };
}

export class SingleClient extends CommandAPI {
  constructor(config: ClientConfig) {
    super(() => rawClientGetter(config));
  }
};


export class SimpleClient extends CommandAPI {
  constructor(client: RawClient) {
    super(() => Promise.resolve(client));
  }
};
