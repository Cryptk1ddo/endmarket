export default {
  kind: "collectionType",
  collectionName: "brands",
  info: {
    singularName: "brand",
    pluralName: "brands",
    displayName: "Brand",
    description: "AC brands sold by TENDMARKET — Ballu, Haier, Hisense",
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {
    i18n: {
      localized: true,
    },
  },
  attributes: {
    name: {
      type: "string",
      required: true,
    },
    slug: {
      type: "uid",
      targetField: "name",
      required: true,
    },
    origin: {
      type: "string",
      required: true,
    },
    tagline: {
      type: "string",
      pluginOptions: { i18n: { localized: true } },
    },
    description: {
      type: "text",
      pluginOptions: { i18n: { localized: true } },
    },
    longDescription: {
      type: "richtext",
      pluginOptions: { i18n: { localized: true } },
    },
    logo: {
      type: "media",
      multiple: false,
      required: false,
      allowedTypes: ["images"],
    },
    coverImage: {
      type: "media",
      multiple: false,
      required: false,
      allowedTypes: ["images"],
    },
    gallery: {
      type: "media",
      multiple: true,
      required: false,
      allowedTypes: ["images"],
    },
    featured: {
      type: "boolean",
      default: false,
    },
    sortOrder: {
      type: "integer",
      default: 0,
    },
    websiteUrl: {
      type: "string",
    },
    foundedYear: {
      type: "integer",
    },
    designPhilosophy: {
      type: "text",
      pluginOptions: { i18n: { localized: true } },
    },
  },
};
