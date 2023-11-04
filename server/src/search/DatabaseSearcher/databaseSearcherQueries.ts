//do heavy lifting in the SQL search.
//We do an inner and outer query.  Inner query joins together the service and works with the arrays from the many to many relationships through GROUP_CONCAT
//The outer query weights them and orders and limits the result.  We do the inner and outer format due to the fact that our GROUP_CONCAT generates the column name that the weighting references
const searchServicesQuery = `
WITH WeightedServices AS (
  SELECT
    services.id,
    services.name,
    services.description,
    services.category,
    services.organisation,
    services.referralPathway,
    services.minRequirementsToAccess,
    GROUP_CONCAT(DISTINCT clientGroups.groupName) AS client_groups,
    GROUP_CONCAT(DISTINCT needsMet.need) AS needs_met,
    GROUP_CONCAT(DISTINCT areasServed.area) AS areas_served
  FROM
    service_areas
  JOIN
    areasServed ON service_areas.area_id = areasServed.id
  JOIN
    services ON service_areas.service_id = services.id
  JOIN
    service_needs ON services.id = service_needs.service_id
  JOIN
    needsMet ON service_needs.need_id = needsMet.id
  JOIN
    service_clientGroups ON services.id = service_clientGroups.service_id
  JOIN
    clientGroups ON service_clientGroups.clientGroup_id = clientGroups.id
  GROUP BY
    services.id,
    services.name,
    services.description,
    services.category,
    services.organisation,
    services.referralPathway,
    services.minRequirementsToAccess
  HAVING
    client_groups LIKE ?
    OR name LIKE ?
    OR description LIKE ?
    OR category LIKE ?
    OR referralPathway LIKE ?
    OR minRequirementsToAccess LIKE ?
    OR needs_met LIKE ?
    OR areas_served LIKE ?
)
SELECT
  *,
  CASE
    WHEN name LIKE ? THEN 9
    WHEN organisation LIKE ? THEN 8
    WHEN description LIKE ? THEN 7
    WHEN referralPathway LIKE ? THEN 6
    WHEN needs_met LIKE ? THEN 5
    WHEN client_groups LIKE ? THEN 4
    WHEN areas_served LIKE ? THEN 3
    WHEN minRequirementsToAccess LIKE ? THEN 2
    WHEN organisation LIKE ? THEN 1
    ELSE 0
  END AS weighting
FROM WeightedServices
ORDER BY weighting DESC
LIMIT 100;
`;

export default { searchServicesQuery };
