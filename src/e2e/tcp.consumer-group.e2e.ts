
import { after, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Client, SingleClient } from '../client/client.js';
import { ConsumerKind, PollingStrategy, Partitioning } from '../wire/index.js';
import { generateMessages } from '../tcp.sm.utils.js';

describe('e2e -> consumer-group', async () => {

  const c = new SingleClient({
    transport: 'TCP',
    options: { port: 8090, host: '127.0.0.1' },
    credentials: { username: 'iggy', password: 'iggy' }
  });
  
  const streamId = 555;
  const topicId = 666;

  const stream = {
    streamId,
    name: 'e2e-consumer-group-stream'
  };

  const topic = {
    streamId,
    topicId,
    name: 'e2e-consumer-group-topic',
    partitionCount: 3,
    compressionAlgorithm: 1
  };

  let payloadLength = 0;

  await c.stream.create(stream);
  await c.topic.create(topic);

  const groupId = 333;
  const group = { streamId, topicId, groupId, name: 'e2e-cg-1' };

  it('e2e -> consumer-group::create', async () => {
    const r = await c.group.create(group);
    assert.deepEqual(
      r, { id: groupId, name: 'e2e-cg-1', partitionsCount: 3, membersCount: 0 }
    );
  });

  it('e2e -> consumer-group::get', async () => {
    const gg = await c.group.get({ streamId, topicId, groupId });
    assert.deepEqual(
      gg, { id: groupId, name: 'e2e-cg-1', partitionsCount: 3, membersCount: 0 }
    );
  });

  it('e2e -> consumer-group::list', async () => {
    const lg = await c.group.list({ streamId, topicId });
    assert.deepEqual(
      lg,
      [{ id: groupId, name: 'e2e-cg-1', partitionsCount: 3, membersCount: 0 }]
    );
  });

  it('e2e -> consumer-stream::send-messages', async () => {
    const ct = 1000;
    const mn = 200;
    for (let i = 0; i <= ct; i += mn) {
      c.message.send({
        streamId, topicId,
        messages: generateMessages(mn),
        partition: Partitioning.MessageKey(`key-${ i % 400 }`)
      });
    }
    payloadLength = ct;
  });

  it('e2e -> consumer-group::join', async () => {
    assert.ok(await c.group.join({ streamId, topicId, groupId }));
  });

  it('e2e -> consumer-group::poll', async () => {
    const pollReq = {
      streamId,
      topicId,
      consumer: { kind: ConsumerKind.Group, id: groupId },
      partitionId: 0,
      pollingStrategy: PollingStrategy.Next,
      count: 100,
      autocommit: true
    };
    let ct = 0;
    while (ct < payloadLength) {
      const { messages, ...resp } = await c.message.poll(pollReq);
      assert.equal(messages.length, resp.messageCount);
      ct += messages.length;
    }
    assert.equal(ct, payloadLength);

    const { messages, ...resp } = await c.message.poll(pollReq);
    assert.equal(resp.messageCount, 0);
  });

  it('e2e -> consumer-group::leave', async () => {
    assert.ok(await c.group.leave({ streamId, topicId, groupId }));
  });

  it('e2e -> consumer-group::delete', async () => {
    assert.ok(await c.group.delete({ streamId, topicId, groupId }));
  });

  after(async () => {
    assert.ok(await c.stream.delete(stream));
    assert.ok(await c.session.logout());
    await c.destroy();
  });
});
