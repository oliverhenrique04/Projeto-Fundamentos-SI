import pathlib
src = pathlib.Path('src')
shell = (src/'shell.html').read_text()
app = '\n'.join((src/f).read_text() for f in ['core.js','building.js','slides.js','app.js'])
out = shell.replace('/*__CSS__*/', (src/'style.css').read_text()).replace('/*__DATA__*/', (src/'data.js').read_text()).replace('/*__APP__*/', app)
pathlib.Path('index.html').write_text(out)
print(len(out))
