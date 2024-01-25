//find a query string

const findQueryParam = (
  urlSearch: string,
  queryParam: string
): string | undefined => {
  const paramArray = urlSearch.split("&");
  let paramResult = "";
  paramArray.forEach((param) => {
    if (param.includes(`${queryParam}=`)) paramResult = param.split("=")[1];
  });
  if (paramResult !== "") return paramResult;
  return undefined;
};

export default findQueryParam;
