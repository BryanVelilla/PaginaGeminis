import Parser from 'rss-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.resolve(__dirname, '../public/data/news.json');

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  },
  timeout: 9000
});

// Fuentes verificadas y de alto impacto
const FEEDS = [
  {
    name: 'INCIBE',
    sourceUrl: 'https://www.incibe.es',
    feedUrl: 'https://www.incibe.es/rss.xml',
    defaultCategory: 'advisory',
    defaultCategoryLabel: 'Aviso Oficial',
    defaultBadge: 'Oficial'
  },
  {
    name: 'The Hacker News',
    sourceUrl: 'https://thehackernews.com',
    feedUrl: 'https://feeds.feedburner.com/TheHackersNews',
    defaultCategory: 'cybersecurity',
    defaultCategoryLabel: 'Ciberseguridad',
    defaultBadge: 'Breaking'
  },
  {
    name: 'CISA Advisories',
    sourceUrl: 'https://www.cisa.gov',
    feedUrl: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',
    defaultCategory: 'vulnerability',
    defaultCategoryLabel: 'Vulnerabilidades',
    defaultBadge: 'Alerta'
  },
  {
    name: 'Cloudflare',
    sourceUrl: 'https://blog.cloudflare.com',
    feedUrl: 'https://blog.cloudflare.com/rss/',
    defaultCategory: 'networking',
    defaultCategoryLabel: 'Redes & Cloud',
    defaultBadge: 'Infraestructura'
  },
  {
    name: 'Cisco Blogs',
    sourceUrl: 'https://blogs.cisco.com',
    feedUrl: 'https://blogs.cisco.com/feed',
    defaultCategory: 'networking',
    defaultCategoryLabel: 'Redes & Protocolos',
    defaultBadge: 'Networking'
  },
  {
    name: 'WeLiveSecurity (ESET)',
    sourceUrl: 'https://www.welivesecurity.com',
    feedUrl: 'https://www.welivesecurity.com/en/rss/feed/',
    defaultCategory: 'threat-intel',
    defaultCategoryLabel: 'Threat Intel',
    defaultBadge: 'Análisis'
  }
];

function cleanHtmlText(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ') // Quitar etiquetas HTML
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateText(text, maxChars = 210) {
  if (!text) return '';
  if (text.length <= maxChars) return text;
  const cut = text.substring(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.substring(0, lastSpace) : cut) + '...';
}

function classifyArticle(title, content, feedConfig) {
  const combined = `${title} ${content}`.toLowerCase();

  if (/router|switch|bgp|dns|dhcp|ipsec|ipv6|routing|latency|mpls|sd-wan|backbone|protocol|telecom|ethernet/.test(combined)) {
    return { category: 'networking', categoryLabel: 'Redes & Protocolos', badge: 'Redes' };
  }
  if (/zero-day|0-day|rce|cve-|vulnerability|exploit|patch|buffer overflow|privilege escalation|desbordamiento|parche/.test(combined)) {
    return { category: 'vulnerability', categoryLabel: 'Vulnerabilidades', badge: 'CVE / Patch' };
  }
  if (/ransomware|malware|trojan|spyware|botnet|phishing|stealer|c2|payload|keylogger/.test(combined)) {
    return { category: 'threat-intel', categoryLabel: 'Threat Intel', badge: 'Malware' };
  }
  if (/incibe|cisa|alerta|advisory|emergency|boletín|aviso/.test(combined)) {
    return { category: 'advisory', categoryLabel: 'Aviso Oficial', badge: 'Alerta' };
  }

  return {
    category: feedConfig.defaultCategory,
    categoryLabel: feedConfig.defaultCategoryLabel,
    badge: feedConfig.defaultBadge
  };
}

async function fetchAllNews() {
  console.log('🛡️ Iniciando sincronización de noticias de Ciberseguridad y Redes...');
  const allItems = [];
  const successfulSources = [];

  for (const feed of FEEDS) {
    try {
      console.log(`📡 Consultando ${feed.name}...`);
      const parsed = await parser.parseURL(feed.feedUrl);
      successfulSources.push(feed.name);

      const items = (parsed.items || []).slice(0, 10);
      for (const item of items) {
        if (!item.title || !item.link) continue;

        const rawSummary = item.contentSnippet || item.summary || item.content || '';
        const cleanSummary = cleanHtmlText(rawSummary);
        const summary = truncateText(cleanSummary, 220) || 'Haz clic para leer el informe completo en la fuente oficial.';
        
        const pubDateObj = item.isoDate ? new Date(item.isoDate) : (item.pubDate ? new Date(item.pubDate) : new Date());
        const timestamp = pubDateObj.getTime();

        const classification = classifyArticle(item.title, cleanSummary, feed);

        const id = `${feed.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp}-${Math.abs(item.title.length)}`;

        allItems.push({
          id,
          title: cleanHtmlText(item.title),
          summary,
          url: item.link,
          source: feed.name,
          sourceUrl: feed.sourceUrl,
          category: classification.category,
          categoryLabel: classification.categoryLabel,
          pubDate: pubDateObj.toISOString(),
          timestamp,
          author: item.creator || item.author || feed.name,
          badge: classification.badge
        });
      }
      console.log(`  ✓ ${feed.name}: ${items.length} noticias procesadas.`);
    } catch (err) {
      console.warn(`  ⚠️ Error al consultar ${feed.name}: ${err.message}. Se continuará con las demás fuentes.`);
    }
  }

  // Deduplicar por URL y Título normalizado
  const seen = new Set();
  const uniqueItems = allItems.filter(item => {
    const key = (item.url || item.title).toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Ordenar por fecha cronológica descendente (lo más nuevo primero)
  uniqueItems.sort((a, b) => b.timestamp - a.timestamp);

  // Mantener las 24 más relevantes y recientes
  const finalItems = uniqueItems.slice(0, 24);

  const payload = {
    lastUpdated: new Date().toISOString(),
    totalItems: finalItems.length,
    sources: successfulSources,
    items: finalItems
  };

  // Asegurar directorio destino
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf-8');

  console.log(`\n✅ ¡Sincronización completada!`);
  console.log(`📁 Guardado en: ${OUTPUT_FILE}`);
  console.log(`📊 Total de noticias generadas: ${payload.totalItems}`);
  console.log(`🕒 Última actualización: ${payload.lastUpdated}`);
}

fetchAllNews().catch(err => {
  console.error('❌ Error fatal al actualizar noticias:', err);
  process.exit(1);
});
