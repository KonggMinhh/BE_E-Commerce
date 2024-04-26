const pagionation = async (model, query, currentPage, limit) => {
  const total = await model.find(query).countDocuments();
  const next = currentPage + 1;
  const prev = currentPage - 1;
  const totalPages = Math.ceil(total / limit);
  const hasNext = currentPage >= totalPages ? false : true;
  const hasPrev = currentPage <= 1 ? false : true;
  return {
    total,
    totalPages,
    currentPage,
    next,
    prev,
    hasNext,
    hasPrev,
  };
};
module.exports = pagionation;
