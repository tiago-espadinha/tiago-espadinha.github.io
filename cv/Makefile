# Builds the CV in each language from the site's content and copies the PDFs
# to the site's assets. Usually run as `npm run cv`.
#   make          build both and publish them to ../assets
#   make en       build one language into build/
#   make clean    remove build/

LANGS  := en pt
NAME   := tiago_simoes-cv
BUILD  := build
ASSETS := ../assets
LATEXMK := latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=$(BUILD)

# Everything the generated .tex is made from.
SOURCES := $(wildcard ../content/*.js) ../js/lib/i18n.js ../scripts/build-cv.mjs

# The site links to these from content/contact.js.
PUBLISHED := $(LANGS:%=$(ASSETS)/$(NAME)_%.pdf)

.PHONY: all $(LANGS) clean
# Keep build/ outputs, which make would otherwise delete as intermediate.
.PRECIOUS: $(BUILD)/cv-%.tex $(BUILD)/$(NAME)_%.pdf

all: $(PUBLISHED)

$(LANGS): %: $(BUILD)/$(NAME)_%.pdf

$(BUILD)/cv-%.tex: $(SOURCES)
	node ../scripts/build-cv.mjs $* $@

$(BUILD)/$(NAME)_%.pdf: $(BUILD)/cv-%.tex preamble.tex resume.cls
	$(LATEXMK) -jobname=$(NAME)_$* $<

$(ASSETS)/$(NAME)_%.pdf: $(BUILD)/$(NAME)_%.pdf
	cp $< $@

clean:
	rm -rf $(BUILD)
