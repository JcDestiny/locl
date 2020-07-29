const message = require('@commitlint/message');

function getErrorMsg(negated, value, types) {
  return message.default([
    'body',
    negated ? 'may not' : 'must',
    `contain [${value}] for scopes [${types.join(', ')}]`,
  ]);
}

module.exports = {
  rules: {
    'body-content': function (parsed, when, params) {
      const body = parsed.body;
      const footer = parsed.footer;
      const type = parsed.type;
      const negated = when === 'never';
      const value = params[0];
      const types = params[1];
      if (!body && !footer) {
        if (negated || types.indexOf(type) === -1) {
          return [true];
        } else {
          return [false, getErrorMsg(negated, value, types)];
        }
      }

      const hasRegexp =
        (body
          ? body.split(/[\r\n]+/).find((str) => str.search(value) !== -1)
          : false) ||
        (footer
          ? footer.split(/[\r\n]+/).find((str) => str.search(value) !== -1)
          : false);

      return [
        negated ? !hasRegexp : hasRegexp,
        getErrorMsg(negated, value, types),
      ];
    },
  },
};
