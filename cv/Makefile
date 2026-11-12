# Builds the CV in each language and copies the PDFs to the site's assets.
#   make          build both and publish them to ../assets
#   make en       build one language into build/
#   make clean    remove build/

LANGS  := en pt
BUILD  := build
ASSETS := ../assets
LATEXMK := latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=$(BUILD)

# The English CV is the one the site links to as cv.pdf.
PUBLISHED := $(ASSETS)/cv.pdf $(ASSETS)/cv-pt.pdf

.PHONY: all $(LANGS) clean

all: $(PUBLISHED)

$(LANGS): %: $(BUILD)/cv-%.pdf

$(BUILD)/cv-%.pdf: cv-%.tex preamble.tex resume.cls
	$(LATEXMK) $<

$(ASSETS)/cv.pdf: $(BUILD)/cv-en.pdf
	cp $< $@

$(ASSETS)/cv-pt.pdf: $(BUILD)/cv-pt.pdf
	cp $< $@

clean:
	rm -rf $(BUILD)
