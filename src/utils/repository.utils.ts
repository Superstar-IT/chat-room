export function getFromDto<T>(
  dto: any,
  data: any,
  fields?: string[],
  exceptedFields?: string[],
): T {
  const exceptedProperties = new Set(exceptedFields || []);
  let properties: string[] = [];
  if (fields && fields.length) {
    properties = fields;
  } else {
    properties = Object.keys(dto);
  }
  properties.forEach((property) => {
    if (exceptedProperties.has(property)) return;
    data[property] = dto[property];
  });
  return data;
}
