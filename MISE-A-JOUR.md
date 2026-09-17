# Karu 1.0.3 — Halos et commandes de gestion

Décompresser puis déposer les **7 fichiers d’application** à la racine du dépôt Karu : app.js, feedback.js, styles.css, index.html, sw.js, engine.js et storage.js. Remplacer les versions existantes. Aucun dossier supplémentaire à créer. Après le déploiement, ouvrir en ligne puis fermer toutes les fenêtres Karu et l’application installée avant de rouvrir. Vérifier VERSION 1.0.3 dans les réglages. Ne pas supprimer les données du navigateur.

## Lumière et notifications

Les halos des objets magiques et du ki sont plus larges, flous et diffus, placés autour des surfaces. Le centre reste sombre pour protéger la lecture. Le pop-up de notification utilise le thème jade/bronze, une bordure dorée scintillante et une lumière extérieure colorée selon l’action. Sa couleur reste stable pendant les cinq secondes d’affichage. Un toucher sur l’écran le ferme et consomme ce geste pour éviter d’activer un bouton derrière. Échap fonctionne également. La réduction des animations reste respectée. Les grandes fiches détaillées d’attaques/objets restent ouvertes sans minuterie.

## Suppression d’objets

Dans la fiche d’un objet, choisir Supprimer cet objet, puis confirmer. L’objet et ses bonus sont retirés, l’harmonisation est libérée. Le contenu d’un conteneur n’est pas supprimé avec lui. Un bouton Annuler est maintenant accessible dans l’inventaire. L’annulation générale reste limitée à la session ouverte (30 opérations).

## Annuler le tour en cours

Le bouton apparaît en combat. Après confirmation, il restaure le début enregistré du tour : PV, PV temporaires, ki, usages, actions, réaction, déplacement, états, effets, inventaire et monnaie. Les changements d’objets faits pendant ce tour sont donc annulés aussi. Les notes et les catégories personnelles, les réglages et l’historique restent conservés. Le tour reste actif et peut être rejoué.

Le point de reprise est enregistré dans la partie et survit au rechargement et à l’export/import. Sur une ancienne sauvegarde sans point de reprise, le premier repère est l’état lors de l’ouverture de cette mise à jour : il ne peut pas reconstituer les actions précédentes. Les tours suivants disposent de leur véritable début enregistré.

## Réinitialiser la rencontre

Après confirmation : retour au tour 1, action/bonus/réaction/déplacement disponibles, effets à échéance de tour retirés. **Aucun repos n’est accordé.** Les PV, PV temporaires, ki, dés de vie, usages par repos/aube, munitions, inventaire, monnaie, états de Karu, carapace et effets à retrait manuel restent conservés. Les restrictions de carapace ou d’inconscience continuent de s’appliquer. L’historique et les notes restent disponibles. Pour récupérer les ressources, utiliser séparément Repos ou Ajustement MJ.

Suppression, annulation du tour et réinitialisation peuvent chacune être inversées par le bouton Annuler.

## Vérification

50 tests automatisés passent : règles et stockage existants, suppression d’objet et retrait des bonus, restauration du début du tour après export/import et rechargement, conservation des notes, renouvellement du repère au tour suivant, reset sans recharge, annulation des trois nouvelles opérations, durée de notification et interception du toucher de fermeture. Syntaxe JavaScript contrôlée. Les fichiers utilisent les chemins plats du dépôt actuel ; les deux modules de règles mis à jour sont déjà dans le cache, dont la version passe à 1.0.3.

Le rendu des halos et le comportement tactile sur un iPhone physique n’ont pas été vérifiés ici. La mise à jour n’est pas publiée automatiquement : l’accès GitHub disponible a précédemment refusé l’écriture.
