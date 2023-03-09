const ObjectToArray = (obj) => {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
};

module.exports = { ObjectToArray };
