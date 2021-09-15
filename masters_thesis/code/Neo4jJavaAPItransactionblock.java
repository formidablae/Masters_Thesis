try (Transaction tx = graphDb.beginTx()) {
	// operations on the graph
	tx.success();
}