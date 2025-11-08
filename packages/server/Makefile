# Makefile for BlueChat Server

.PHONY: lint typecheck test precommit

lint:
	npx eslint src --ext .ts,.tsx

typecheck:
	npx tsc --noEmit

test:
	echo "No tests defined yet. Add your test runner here."

precommit: lint typecheck
	@echo "Pre-commit checks passed."
