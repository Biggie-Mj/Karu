# Vérification de Karu v1.0.0

Date : 17 septembre 2026. Application statique, sans dépendance externe à l’exécution.

## Résultat reproductible

**49 tests automatisés réussis, 0 échec**, lancés avec `node --test tests/*.test.mjs`. Le détail brut est dans `tests/RESULTATS.txt`. Les tests utilisent Node et des substituts contrôlés du stockage, des événements et du cache ; ils ne constituent pas un essai sur Safari.

| Domaine | Vérifié automatiquement |
|---|---|
| Fiche | CA 19/23, DD 15/14, vitesse, 18 compétences, 6 sauvegardes, attaques |
| Équipement | Harmonisation limitée à trois, recalcul sans cumul, conditions de ceinture |
| Tour | Deux attaques + Arts martiaux ; deux attaques + Rafale ; bonus unique ; ki insuffisant ; réaction au début du tour |
| Effets | Étourdissante après touche, Main Ouverte après Rafale, échéances de tours, perte d’Esquive |
| Carapace | Restrictions, sortie normale ou ceinture, mouvement gratuit borné |
| Réactions | Parade, renvoi sans consommer une fléchette, fenêtre immédiate, chute bornée |
| PV | Temporaires avant PV, remplacement sans cumul, soins plafonnés, 0 PV, critique reçu, mort massive, stabilisation, jet de mort |
| Repos | Court/long/aube distincts, dés de vie, méditation, recharge d’intégrité |
| Sauvegarde | Rechargement sans repos, annulation conservant les notes, import et copie précédente, corruption conservée, quota signalé |
| Double validation | Une transaction répétée ne dépense qu’une fois ; annulation puis nouvelle validation possible |
| Gestes | Seuil 450 ms, appui bref, déplacement/scroll annulateurs, clic d’attaque supprimé après appui long, fermeture suivante préservée |
| Cache | Tous les fichiers précachés présents, sous-dossier `/Karu/`, réponse sans réseau simulé, navigation avec paramètre de version, ancien cache isolé par application |

Contrôles supplémentaires : syntaxe du module d’interface ; quatre WebP 852 × 1846 ; vingt petites PNG avec véritable canal alpha ; aucun fichier distant nécessaire pour jouer ; chemins relatifs ; zoom non désactivé ; saisies à 16 px ; zones de commande d’au moins 44 px dans les styles ; marges safe-area et réduction des animations.

## Limite importante de cette vérification

Le navigateur disponible a refusé l’aperçu local (`ERR_BLOCKED_BY_CLIENT`, puis politique de sécurité interdisant les URL de fichiers). Aucun contournement n’a été effectué. **Il n’y a donc pas de validation visuelle réelle aux largeurs 320, 375, 390, 430 ou 768 px, ni de test physique sur iPhone/iPad dans cette livraison.** Les parcours complets de l’interface, le contraste effectif sur les illustrations, le clavier iOS et l’installation PWA restent à vérifier dans Safari. Aucun score Lighthouse ou résultat de contraste mesuré n’est revendiqué.

Le fonctionnement du cache a été vérifié dans une simulation de service worker, et non par un démarrage de Safari en mode avion. L’appui long est testé par événements isolés, pas par un geste sur écran tactile.

## Recette à exécuter sur l’adresse GitHub Pages

1. Ouvrir Safari, attendre « Hors ligne prêt », puis installer sur l’écran d’accueil. Fermer l’app, activer le mode avion, rouvrir et visiter les quatre modes.
2. Vérifier portrait et paysage, largeur 320–430 px, iPad ; aucun débordement horizontal. Agrandir le texte et tester Lisibilité renforcée / Réduire les animations.
3. Combat : annuler une attaque avant confirmation, puis deux attaques + Arts martiaux. Au tour suivant, deux attaques + deux frappes de Rafale. Vérifier ki, bonus unique, annulation et historique.
4. Après une touche, appliquer Étourdissante et Main Ouverte selon leur admissibilité ; terminer le tour et le suivant pour vérifier l’affichage des échéances.
5. Entrer/sortir de carapace avec puis sans propriété de ceinture. Vérifier à terre, déplacement et réaction.
6. Ajouter 5 PV temporaires, subir 8 dégâts, soigner, tester 0 PV, stabiliser puis annuler. Doubler rapidement le toucher sur Valider : une seule opération.
7. Tester repos court/long/aube, recharger la page et vérifier que les ressources ne récupèrent pas spontanément.
8. Social : saisir un jet manuel avec avantage ; équiper/ranger les brassards ; rechercher, créer et modifier un objet ; essayer une quatrième harmonisation.
9. Journal : créer une catégorie, une note, fermer par la croix, rechercher, supprimer/restaurer ; recharger. Saisir une longue note avec le clavier iOS affiché.
10. Exporter la partie, modifier des PV, importer avec aperçu puis revenir à la sauvegarde précédente.
11. Appui long sur attaque, aptitude et objet ; défiler avant 450 ms ; fermer le panneau par le voile ; vérifier qu’aucune attaque n’a été lancée.

Cette recette reste nécessaire avant de qualifier l’interface de validée sur iPhone. Le code, les données et les tests sont livrés pour permettre les corrections sans refaire l’application.
