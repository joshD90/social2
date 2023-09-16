const joinServiceTables =
  "SELECT services.*, needsMet.need, areasServed.area, clientGroups.groupName FROM service_areas JOIN areasServed ON service_areas.area_id = areasServed.id JOIN services ON service_areas.service_id = services.id JOIN service_needs ON services.id = service_needs.service_id JOIN needsMet ON service_needs.need_id = needsMet.id JOIN service_clientGroups ON services.id = service_clientGroups.service_id JOIN clientGroups ON service_clientGroups.clientGroup_id = clientGroups.id;";

export default { joinServiceTables };
