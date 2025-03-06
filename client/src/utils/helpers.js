export const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  export const isDelayed = (endDate) => {
    return new Date(endDate) < new Date();
  };