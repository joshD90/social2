//find a query string

const findQueryParam = (
  urlSearch: string,
  queryParam: string
): string | boolean => {
  const paramArray = urlSearch.split("&");
  let paramResult = "";
  paramArray.forEach((param) => {
    if (param.includes(`${queryParam}=`)) paramResult = param.split("=")[1];
  });
  if (paramResult !== "") return paramResult;
  return false;
};

export default findQueryParam;
