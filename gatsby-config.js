const path = require(`path`)

const siteMetadata = require('./src/siteMetadata/midasJournal.json')
const targetJournal = siteMetadata.targetJournal

const findSearchData = (node, entry) => {

  let data = ""
  if(node.publication) {
    for(let i = 0; i < node.publication.journals.length; i++) {
      let journal_data = node.publication.journals[i];
      if (journal_data.journal_id === targetJournal) {
          data = node.publication[entry];
          break
      }
    }
  }
  return data;
}

module.exports = {
  plugins: [
    'gatsby-plugin-top-layout',
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-plugin-material-ui',
      // If you want to use styled components you should change the injection order.
      options: {
        // stylesProvider: {
        //   injectFirst: true,
        // },
      },
    },
    {
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: {
        // Fields to index
        fields: [`title`, `abstract`, `categories`, `publication_id`],
        // How to resolve each field`s value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields` values
          Json: {
            title: (node) => findSearchData(node, "title"),
            abstract: (node) => findSearchData(node, "abstract"),
            categories: (node ) => findSearchData(node, "categories"),
            publication_id: (node) => findSearchData(node, "publication_id"),
          },
        },
      },
    },
    // If you want to use styled components you should add the plugin here.
    // 'gatsby-plugin-styled-components',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-emotion',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: path.join(__dirname, 'src', 'images'),
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'publications',
        path: path.join(__dirname, 'data', 'publications'),
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'issues',
        path: path.join(__dirname, 'data', 'issues'),
      },
    },
    {
      resolve: 'gatsby-transformer-json',
      options: {
        typeName: 'Json',
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-graphql-config`,
  ],
  siteMetadata,
};
