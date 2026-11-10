# Au Cœur du Vodun - Application Mobile (Frontend)

Application mobile officielle conçue avec **React Native**, **Expo (SDK 58)** et **TypeScript**, conformément au Cahier des Charges.

## Charte Graphique Implémentée
- **Vert profond (`#17372D`)** : Tradition, nature et sérénité.
- **Or traditionnel (`#D3B36A`)** : Prestige et spiritualité.
- **Ivoire (`#F6F2E9`)** : Clarté et lisibilité (fond de l'application).
- **Terre cuite (`#A65C3A`)** : Ancrage culturel.

## Structure des Écrans (Expo Router)

### Onglets Principaux (`app/(tabs)`)
1. **Accueil (`index.tsx`)** :
   - Présentation du Temple & du Bokonon (Abomey-Calavi, Quartier Zoundja).
   - Accès rapides aux actions majeures (Fadu, Consultation, Rendez-vous, Assistant).
   - Actualités et cérémonies du temple.
   - Lien vers le site officiel : `https://aucoeurduvodun.com/`.
2. **Services (`services.tsx`)** :
   - Catalogue avec filtres par catégorie : *Fâ*, *Vodun*, *Bo*, *Zannuyun*, *Coaching*.
   - Fiches détaillées : durée, tarif / sur devis, modalités (présentiel / distance).
3. **Rendez-vous (`rendez-vous.tsx`)** :
   - Prise de rendez-vous (sur place au temple ou à distance en visio / appel).
   - Sélection de dates et créneaux horaires (fuseau horaire GMT+1 Bénin).
   - Historique des rendez-vous avec statuts (*Confirmé*, *En attente*, *Terminé*).
4. **Échanges (`echanges.tsx`)** :
   - Messagerie privée sécurisée avec le Temple et le Bokonon.
   - Suivi direct des demandes de Fadu (#FADU-XXXX) et rendez-vous (#RDV-XXXX).
5. **Profil (`profil.tsx`)** :
   - Espace utilisateur & préférences de notifications.
   - Résumé des démarches et protection des données spirituelles.

### Écrans Spécialisés & Modaux (`app/`)
- **Transmission de Fadu (`fadu.tsx`)** :
  - Consignes de prise de vue & respect du caractère sacré.
  - Sélection / capture d'image avec aperçu et attribution d'un numéro de suivi.
  - Formulaire de contexte et question pour le Bokonon.
- **Demande de Consultation (`consultation.tsx`)** :
  - Formulaire complet avec choix de modalité et langue (*Français*, *Fɔngbè*).
- **Assistant du Temple (`assistant.tsx`)** :
  - Chatbot à questions-réponses prédéfinies (horaires, localisation, déroulement, tarifs).
- **Découverte du Temple (`temple.tsx`)** :
  - Histoire, Bokonon, coordonnées à Abomey-Calavi Zoundja et contact.

## Démarrage du projet

```bash
cd frontend

# Lancer le serveur Metro Expo
npm start

# Lancer directement sur Android
npm run android

# Lancer directement sur iOS
npm run ios

# Lancer la prévisualisation Web
npm run web
```

