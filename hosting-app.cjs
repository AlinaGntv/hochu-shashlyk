// For Jino: copy this file to the domain's home folder as app.js.
// The Node source and dependencies stay in the `source` subfolder.
import('./source/server/app.js').catch((error) => {
  console.error('Could not start the site API:', error)
})
