const fetchAllChildrenServices =
  "SELECT id, name, forwardTo, category FROM services WHERE parent_service = ?";

const fetchAllServicesMinimal = "SELECT id, name FROM services";

export { fetchAllChildrenServices, fetchAllServicesMinimal };
