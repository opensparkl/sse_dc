# Copyright 2018 SPARKL Limited
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# Makefile with targets used when this is a git submodule in
# the sse_core repo.
SHELL := /bin/bash
ROOT := $(shell git rev-parse --show-toplevel)
APP := $(shell basename `pwd`)

SRC_DIR := src
BUILD_DIR := dist
PLACE_DIR := ../../apps/sse_yaws/priv/docroot
PLACE_NAME := sse_dc

LINT := ./node_modules/.bin/eslint

PREBUILD := src/generated/version.json
COMPILE := $(BUILD_DIR)/.compile
RELEASE := $(BUILD_DIR)/.release

SOURCES := $(shell find src/**/*)

.PHONY: default
default: help

$(PREBUILD):
	@node build/prebuild.js

.PHONY: debug
debug: $(PREBUILD)
	@node build/dev-server.js

.PHONY: compile
compile: $(COMPILE)

$(COMPILE): $(PREBUILD) $(SOURCES)
	@node build/debug.js
	@touch $@

.PHONY: rel
rel: $(RELEASE)

$(RELEASE): $(PREBUILD) $(SOURCES)
	@node build/build.js
	@touch $@

.PHONY: deps
deps: $(BUILD_DIR)
	@npm install
	@rm -f $(PLACE_DIR)/$(PLACE_NAME)
	@cd $(PLACE_DIR) && ln -s $(realpath $(BUILD_DIR)) $(PLACE_NAME)

$(BUILD_DIR):
	@mkdir -p $@

.PHONY: lint
lint: LINT_CMD := ./node_modules/.bin/eslint
lint: $(LINT_CMD)
	@$(LINT_CMD) --ext .js,.vue src

.PHONY: eunit
eunit:
	@echo No tests.

.PHONY: clean
clean:
	@rm -rf $(BUILD_DIR)

.PHONY: clean_deps
clean_deps:
	@rm -rf node_modules

.PHONY: help
help:
	@echo "sse_dc is built using VueJS and Webpack which are"
	@echo "invoked using nodejs"
	@echo "Targets:"
	@echo "  clean    - cleans the 'dist' directory"
	@echo "  debug    - builds un-minified in 'dist' and runs"
	@echo "             a server that immediately redeploys edits"
	@echo "             and provides source .vue file debugging in"
	@echo "             the browser"
	@echo "  compile  - builds un-minified in 'dist'"
	@echo "  rel      - builds minified in 'dist'"
