import _ from 'lodash';
import Chance from 'chance';
const chance = new Chance();

function getUserRecord(overrides: any = {}) {
  const newObj = _.cloneDeep(overrides || {});
  return _.defaults(newObj, {
    email: chance.email(),
    password: chance.string({ length: 8 }),
  });
}

export { getUserRecord };
