
import { after, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '../client/client.js';

describe('e2e -> user', async () => {

  const c = new Client({
    transport: 'TCP',
    options: { port: 8090, host: '127.0.0.1' },
    credentials: { username: 'iggy', password: 'iggy' }
  });

  const username = 'test-user';
  const password = 'test-pwd123$!';
  const status = 1; // Active;
  const permissions = {
    global: {
      ManageServers: false,
      ReadServers: false,
      ManageUsers: true,
      ReadUsers: true,
      ManageStreams: true,
      ReadStreams: true,
      ManageTopics: true,
      ReadTopics: true,
      PollMessages: true,
      SendMessages: true
    },
    streams: []
  };

  const cUser = { username, password, status, permissions };

  it('e2e -> user::create', async () => {
    const user = await c.user.create(cUser);
    assert.ok(user);
  });

  it('e2e -> user::list', async () => {
    const users = await c.user.list();
    assert.ok(users.length > 0);
  });

  it('e2e -> user::get#name', async () => {
    const user = await c.user.get({ userId: username });
    assert.ok(user);
  });

  it('e2e -> user::get#id', async () => {
    const u1 = await c.user.get({ userId: username });
    const u2 = await c.user.get({ userId: u1.id });
    assert.deepEqual(u1, u2);
  });

  it('e2e -> user::update', async () => {
    const user = await c.user.get({ userId: username });
    const u2 = await c.user.update({
      userId: user.id,
      status: 2
    });
    assert.ok(u2);
  });

  it('e2e -> user::changePassword', async () => {
    const user = await c.user.get({ userId: username });
    assert.ok(await c.user.changePassword({
      userId: user.id, currentPassword: password, newPassword: 'h4x0r42'
    }));
  });

  it('e2e -> user::updatePermissions', async () => {
    const user = await c.user.get({ userId: username });
    const perms2 = { ...permissions };
    perms2.global.ReadServers = true;
    const u2 = await c.user.updatePermissions({
      userId: user.id, permissions: perms2
    });
    assert.ok(u2);
  });
  
  it('e2e -> user::delete', async () => {
    const user = await c.user.get({ userId: username });
    assert.ok(await c.user.delete({ userId: user.id }));
  });

  it('e2e -> user::logout', async () => {
    assert.ok(await c.session.logout());
  });

  after(() => {
    c.destroy();
  });
});
