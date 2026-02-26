const stripHtml = (value) => {
  if (typeof value !== "string") {
    return value;
  }
  return value.replace(/<[^>]*>?/gm, "").trim();
};

const sanitizeKey = (key) => key.replace(/^\$+/g, "").replace(/\./g, "");

const sanitizeData = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeData);
  }

  if (value && typeof value === "object" && value.constructor === Object) {
    const sanitizedObject = {};
    Object.entries(value).forEach(([key, nestedValue]) => {
      const cleanKey = sanitizeKey(key);
      if (!cleanKey) {
        return;
      }
      sanitizedObject[cleanKey] = sanitizeData(nestedValue);
    });
    return sanitizedObject;
  }

  return stripHtml(value);
};

const sanitizeInput = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeData(req.body);
  }

  if (req.params && typeof req.params === "object") {
    req.params = sanitizeData(req.params);
  }

  if (req.query && typeof req.query === "object") {
    const sanitizedQuery = sanitizeData(req.query);
    Object.keys(req.query).forEach((key) => {
      delete req.query[key];
    });
    Object.assign(req.query, sanitizedQuery);
  }

  next();
};

module.exports = sanitizeInput;

