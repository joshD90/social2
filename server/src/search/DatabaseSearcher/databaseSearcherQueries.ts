const searchServicesQuery = `
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
    OR areas_served LIKE ?;
`;

export default { searchServicesQuery };

//id, name, description, category, client_groups, organisation, referralPathway, minRequirementsToAccess, needs_met, areas_served
