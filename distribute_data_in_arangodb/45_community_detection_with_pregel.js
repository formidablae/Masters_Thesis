// Javascript commands to execute in terminal
// on DB host machine to detect
// communities, clusters in graph

db._databases()
db._useDatabase('academic_db')

// Label Propagation (LP) Algorithm for distinct communities, consumes little memory
const pregel = require("@arangodb/pregel");
const handle = pregel.start(
    'labelpropagation',
    'author_publisher_editor_journal_publication_series_affiliation_school_cited_crossreffed',
    { maxGSS: 100, resultField: 'community' }
);
pregel.status(handle);

// Speaker-Listener Label Propagation (SLPA) Algorithm for overlapping communities
const pregel = require("@arangodb/pregel");
const handle = pregel.start(
    'slpa',
    'author_publisher_editor_journal_publication_series_affiliation_school_cited_crossreffed',
    { maxGSS: 100, resultField: 'community', maxCommunities: 1 }
);
pregel.status(handle);

// to cancel
pregel.cancel(handle);