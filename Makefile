TESTS = $(shell find test/ -name "*.test.js" -type f | sort)
REPORTER = dot

check: test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--check-leaks \
		$(TESTS)

.PHONY: test
