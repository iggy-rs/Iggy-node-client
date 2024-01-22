
import type { CommandResponse } from '../../tcp.client.js';
import { type Id } from '../identifier.utils.js';
import { serializeTargetGroup } from './group.utils.js';

export const LEAVE_GROUP = {
  code: 605,

  serialize: (streamId: Id, topicId: Id, groupId: Id) => {
    return serializeTargetGroup(streamId, topicId, groupId);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.length === 0;
  }
};
