"""Verifica o HTML real das URLs indexáveis do sitemap, sem rede."""
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.meta={}; self.canonical=None; self.title=''; self.in_title=False; self.h1=0; self.robots=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='title': self.in_title=True
        if tag=='h1': self.h1+=1
        if tag=='link' and attrs.get('rel')=='canonical': self.canonical=attrs.get('href')
        if tag=='meta':
            name=attrs.get('property',attrs.get('name',''))
            self.meta[name]=attrs.get('content','')
            if name=='robots': self.robots.append(attrs.get('content',''))
    def handle_endtag(self,tag):
        if tag=='title': self.in_title=False
    def handle_data(self,data):
        if self.in_title: self.title+=data

root=Path(sys.argv[1]).resolve()
tree=ElementTree.parse(root/'sitemap.xml')
urls=[node.text for node in tree.findall('.//{*}loc')]
errors=[]
for url in urls:
    route=unquote(urlsplit(url).path).lstrip('/')
    file=(root/route/'index.html').resolve()
    if root not in file.parents or not file.is_file():
        errors.append(f'{url}: HTML correspondente ausente'); continue
    page=Page(); page.feed(file.read_text(encoding='utf-8'))
    for label,actual,expected in [
        ('canonical',page.canonical,url),
        ('og:url',page.meta.get('og:url'),url),
        ('og:title',page.meta.get('og:title'),page.title),
        ('twitter:title',page.meta.get('twitter:title'),page.title),
        ('og:description',page.meta.get('og:description'),page.meta.get('description')),
        ('twitter:description',page.meta.get('twitter:description'),page.meta.get('description')),
    ]:
        if not actual or actual!=expected: errors.append(f'{url}: {label} divergente')
    if page.h1!=1: errors.append(f'{url}: esperado um h1, recebido {page.h1}')
    if any('noindex' in value.lower() or value.lower().strip()=='none' for value in page.robots):
        errors.append(f'{url}: noindex não pode estar no sitemap')
if not urls: errors.append('Sitemap sem URLs.')
if errors:
    print('\n'.join(errors),file=sys.stderr)
    raise SystemExit(1)
print(f'SEO verificado em {len(urls)} páginas: canonical, título, preview, h1 e indexação.')
