export default {
  kind: "collectionType",
  collectionName: "editorials",
  info: {
    singularName: "editorial",
    pluralName: "editorials",
    displayName: "Editorial",
    description: "Editorial content — lookbooks, essays, architectural features",
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
    title: {
      type: "string",
      required: true,
      pluginOptions: { i18n: { localized: true } },
    },
    slug: {
      type: "uid",
      targetField: "title",
      required: true,
    },
    category: {
      type: "enumeration",
      enum: ["lookbook", "essay", "architecture", "material_story", "interview", "project"],
      required: true,
    },
    excerpt: {
      type: "text",
      pluginOptions: { i18n: { localized: true } },
    },
    body: {
      type: "richtext",
      pluginOptions: { i18n: { localized: true } },
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
    publishedAt_custom: {
      type: "datetime",
    },
    author: {
      type: "string",
      pluginOptions: { i18n: { localized: false } },
    },
    tags: {
      type: "json",
    },
    relatedMedusaProductHandles: {
      type: "json",
    },
  },
};
