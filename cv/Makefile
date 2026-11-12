# Builds the CV in each language and copies the PDFs to the site's assets.
#   make          build both and publish them to ../assets
#   make en       build one language into build/
#   make clean    remove build/

LANGS  := en pt
NAME   := tiago_simoes-cv
BUILD  := build
ASSETS := ../assets
LATEXMK := latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=$(BUILD)

# The site links to these from content/contact.js.
PUBLISHED := $(LANGS:%=$(ASSETS)/$(NAME)_%.pdf)

.PHONY: all $(LANGS) clean
# Keep the PDFs in build/, which make would otherwise delete as intermediate.
.PRECIOUS: $(BUILD)/$(NAME)_%.pdf

all: $(PUBLISHED)

$(LANGS): %: $(BUILD)/$(NAME)_%.pdf

$(BUILD)/$(NAME)_%.pdf: cv-%.tex preamble.tex resume.cls
	$(LATEXMK) -jobname=$(NAME)_$* $<

$(ASSETS)/$(NAME)_%.pdf: $(BUILD)/$(NAME)_%.pdf
	cp $< $@

clean:
	rm -rf $(BUILD)
