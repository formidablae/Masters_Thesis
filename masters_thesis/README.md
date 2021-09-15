Lines of
To compile LaTeX on Ubuntu/Debian with VSCode, install texlive
>`$ sudo apt-get install texlive-full`

>`$ tex --version`

>`$ sudo apt-get install texmaker`

>Install VSCode

>Install `LaTeX Workshop` VSCode extension

>Edit `settings.json` file, enter the following and save.

```
{
    // Latex workshop
    "latex-workshop.latex.tools": [
        {
            "name": "latexmk",
            "command": "latexmk",
            "args": [
            "-shell-escape",
            "-synctex=1",
            "-interaction=nonstopmode",
            "-file-line-error",
            "-pdf",
            "%DOC%"
            ]
        }
    ],
    "latex-workshop.latex.recipes": [
        {
            "name": "latexmk",
            "tools": [ "latexmk" ]
        }
    ],
    "latex-workshop.view.pdf.viewer": "tab",  
    "latex-workshop.latex.autoBuild.run": "onSave",
    "latex-workshop.latex.autoClean.run": "onBuilt",
    "latex-workshop.latex.clean.fileTypes": [
        "tex/*.aux",
        "functions/*.aux",
        "*.aux",
        "*.bbl",
        "*.blg",
        "*.idx",
        "*.ind",
        "*.lof",
        "*.lot",
        "*.out",
        "*.toc",
        "*.acn",
        "*.acr",
        "*.alg",
        "*.glg",
        "*.glo",
        "*.gls",
        "*.ist",
        "*.fls",
        "*.log",
        "*.fdb_latexmk"
    ]
}
```