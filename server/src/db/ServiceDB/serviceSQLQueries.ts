const fetchAllChildrenServices =
  "SELECT id, name, forwardTo, category FROM services WHERE parent_service_id = ?";

const fetchAllServicesMinimal = "SELECT id, name FROM services";

const fetchService = (serviceId: number) => `
  SELECT
    s1.id,
    s1.category,
    s1.forwardTo,
    s1.name,
    s1.organisation,
    s1.description,
    s1.maxAge,
    s1.minAge,
    s1.contactNumber,
    s1.contactEmail,
    s1.referralPathway,
    s1.address,
    s1.imageUrl,
    s1.website,
    s1.maxCapacity,
    s1.threshold,
    s1.minRequirementsToAccess,
    s1.parent_service_id,
    s2.category AS parent_service_category,
    s2.forwardTo AS parent_service_forwardTo,
    s2.name AS parent_service_name
  FROM services s1
  LEFT JOIN services s2 ON s1.parent_service_id = s2.id ${
    serviceId && "WHERE s1.id = ?"
  }`;

export { fetchAllChildrenServices, fetchAllServicesMinimal, fetchService };
