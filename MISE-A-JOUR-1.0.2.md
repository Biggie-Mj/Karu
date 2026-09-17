# Karu 1.0.2 — Lumière et retours de combat

Décompresser le ZIP puis déposer son contenu **à la racine du dépôt Karu**, comme pour le correctif précédent. Remplacer `app.js`, `styles.css`, `index.html`, `sw.js` et ajouter `feedback.js`. Aucun sous-dossier à créer.

Après le déploiement GitHub Pages, ouvrir le site en ligne, puis fermer toutes ses fenêtres et l’app installée avant de rouvrir : la nouvelle version du cache doit pouvoir s’activer. Vérifier « VERSION 1.0.2 » dans les réglages. Ne pas effacer les données Safari : cela effacerait la sauvegarde locale.

## Ajouts

- Sept PNG de ki à la place des boules : halo turquoise bleu-vert fluctuant et légèrement décalé entre icônes. Les points dépensés sont atténués et barrés ; la valeur numérique reste lisible.
- Encadrés lumineux bleu-vert sur les cinq objets magiques, ainsi que les objets personnalisés identifiés par harmonisation, effet ou rareté magique.
- Combat : lueur dorée pour le critique, rouge doux pour les dégâts reçus, verte pour les soins/repos, bleue pour la défense, turquoise pour le ki. Animation brève du compteur concerné et apparition douce des dés.
- Vibrations courtes selon l’action lorsque `navigator.vibrate` est disponible et autorisé. Option désactivable dans Réglages. L’absence de cette fonction est signalée ; aucune vibration sur iPhone n’est garantie.
- Les effets partent après validation de l’opération, jamais à l’ouverture d’une attaque. Une validation répétée ignorée ne rejoue pas l’effet.
- Réduction des animations du système ou du compagnon : halos statiques, vibrations et mouvements désactivés. Les auras sont mises en pause lorsque la page est masquée.

## Compatibilité et vérification

Les règles, jets, compteurs et clés de sauvegarde ne sont pas modifiés. La préférence de vibration est facultative : les sauvegardes existantes restent compatibles. Le cache est versionné 1.0.2 et inclut le nouveau module.

Vérifié : syntaxe JavaScript ; classification des effets combat ; identification des objets magiques, dont la calebasse commune ; conservation des objets ordinaires sans aura ; chemins correspondant aux fichiers à la racine ; présence du nouveau module dans le cache. Aucun test tactile ou visuel sur un iPhone physique n’a été réalisé. Les vibrations réelles dépendent du navigateur et de l’appareil.
