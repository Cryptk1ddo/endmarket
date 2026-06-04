export default {
  kind: "collectionType",
  collectionName: "homepage_sections",
  info: {
    singularName: "homepage-section",
    pluralName: "homepage-sections",
    displayName: "Homepage Section",
    description: "Configurable sections for the homepage",
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
    type: {
      type: "enumeration",
      enum: ["hero", "promo_bar", "featured_collection", "manifesto", "editorial", "brands_strip"],
      required: true,
    },
    title: {
      type: "string",
      pluginOptions: { i18n: { localized: true } },
    },
    subtitle: {
      type: "string",
      pluginOptions: { i18n: { localized: true } },
    },
    body: {
      type: "richtext",
      pluginOptions: { i18n: { localized: true } },
    },
    ctaLabel: {
      type: "string",
      pluginOptions: { i18n: { localized: true } },
    },
    ctaUrl: {
      type: "string",
    },
    image: {
      type: "media",
      multiple: false,
      required: false,
      allowedTypes: ["images", "videos"],
    },
    images: {
      type: "media",
      multiple: true,
      required: false,
      allowedTypes: ["images"],
    },
    active: {
      type: "boolean",
      default: true,
    },
    sortOrder: {
      type: "integer",
      default: 0,
    },
    metadata: {
      type: "json",
    },
  },
};
