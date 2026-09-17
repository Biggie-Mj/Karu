# Karu — Grand-Père Coquille · v1.0.0

**État de livraison :** 49 tests automatisés passent. La validation visuelle et tactile sur Safari/iPhone reste à effectuer ; voir `VERIFICATION.md`.

Compagnon statique en français, conçu pour iPhone : Combat, Social/Inventaire, Journal et Accueil. Les visuels sont fournis, sans dépendance à un CDN et sans compte requis.

## Installer sur GitHub Pages

1. Extraire le ZIP. Copier **le contenu du dossier `karu-compagnon`** à la racine de votre dépôt (ou dans son dossier `docs` si vous choisissez ce dossier pour Pages). `index.html` doit être à la racine publiée.
2. Dans GitHub : **Settings → Pages → Deploy from a branch**, choisir votre branche et le dossier correspondant, puis Save.
3. Ouvrir l’adresse fournie par GitHub. Les chemins sont relatifs : un dépôt publié sous `/Karu/` fonctionne.
4. Sur iPhone, ouvrir l’adresse dans **Safari → Partager → Sur l’écran d’accueil**.
5. Lors du premier chargement en ligne, attendre la mention **Hors ligne prêt**. L’application peut ensuite démarrer et fonctionner hors connexion, tant que le navigateur conserve son cache.

Aucune publication n’est effectuée par le ZIP. Ne pas ouvrir simplement index.html via l’application Fichiers : les modules et le mode hors ligne nécessitent HTTP/HTTPS.

## Tester en local

Avec Python 3 : `python3 -m http.server 8080`, depuis ce dossier. Ouvrir `http://localhost:8080`.
Avec Node.js 20 ou supérieur : `npm test` lance les tests sans installer de dépendances.

## Utilisation

- **Combat** : toucher une attaque, choisir jet aléatoire ou manuel, puis confirmer touché/manqué. Jusqu’à la confirmation, rien n’est consommé. Les effets Main Ouverte et Étourdissante apparaissent après une touche admissible.
- **Tour** : Terminer puis Commencer. Une réaction ne se recharge qu’au début du tour.
- **Détails** : appui long de 450 ms ou bouton `i`. Défilement annule l’appui long ; fermeture sans lancer l’attaque.
- **PV** : toucher le bandeau pour le pavé numérique. Les PV temporaires sont remplacés, jamais additionnés.
- **Annuler** : restaure la dernière opération mécanique (30 niveaux), en conservant les notes rédigées entre-temps. L’historique d’annulation est limité à la session ouverte ; l’état et l’historique des jets sont sauvegardés.
- **Repos** : choisir court, long ou aube ; vérifier le récapitulatif et la méditation.
- **Social** : 18 compétences, six caractéristiques, outils et inventaire. Les sauvegardes sont dans Combat → Jets.
- **Inventaire** : objets éditables, équipement, harmonisation (maximum 3), quantités, conteneurs, notes, bourse ; récupération du Sac sans fond coûte une action. Effets d’objets personnalisés et consommables à résoudre avec le MJ.
- **Journal** : notes sauvegardées à chaque saisie, catégories éditables et réordonnables, couleurs, recherche, étiquettes, favoris et corbeille récupérable.
- **Réglages** : modifier la fiche, les textes, ou toutes les données dans l’éditeur JSON avancé. Les paramètres de règles sont dans `character.rules`. Modifier le texte d’une aptitude seul ne reprogramme pas son effet.

## Sauvegardes

L’état est conservé dans localStorage, séparé par chemin de l’application. Ce n’est **pas** une synchronisation entre appareils. Safari, une app installée et un autre navigateur peuvent avoir des espaces séparés. Exporter/importer le fichier JSON pour déplacer sa partie.

L’import est validé, puis présenté avant remplacement. Une copie précédente est conservée et peut être restaurée. Une sauvegarde corrompue est préservée, avec export brut proposé ; elle n’est pas silencieusement écrasée. Une erreur de stockage est signalée. Sauvegarder régulièrement un export : supprimer les données du navigateur ou le cache de l’app peut supprimer la partie.

## Mettre à jour

Remplacer les fichiers sans toucher au stockage du navigateur. Incrémenter `VERSION` dans `sw.js` à chaque publication ; le service worker attend la fermeture des anciennes fenêtres avant activation. Fermer puis rouvrir le compagnon après une mise à jour. Le cache est isolé par chemin, pour ne pas effacer ceux de Silas ou d’un autre compagnon sur le même domaine.

Le schéma de données est v1. Une version inconnue est refusée avant remplacement plutôt qu’importée partiellement. Toute évolution incompatible devra apporter sa migration explicite.

## Structure

- `js/data.js` : personnage, objets, attaques et descriptions.
- `js/source-texts.js` : transcriptions distinctes des textes mécaniques de la fiche.
- `js/gestures.js` : appui long et prévention des clics involontaires.
- `js/engine.js` : calculs et opérations atomiques, sans dépendance à l’interface.
- `js/storage.js` : stockage, annulation, sauvegarde précédente.
- `js/app.js` : interface et interactions tactiles.
- `styles.css` : présentation adaptative, contraste et réduction des animations.
- `sw.js`, `manifest.webmanifest` : installation et cache hors ligne.
- `assets/` : quatre fonds WebP, 20 icônes PNG transparentes et icône d’app.
- `tests/` : vérifications reproductibles du moteur et du service worker.
- `REGLES-ET-ARBITRAGES.md` : décisions mécaniques et limites.
- `VERIFICATION.md` : résultats des contrôles de cette livraison.

Compagnon personnel non officiel. D&D et les noms de règles appartiennent à leurs détenteurs respectifs.
