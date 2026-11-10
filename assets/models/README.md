# Spécifications Techniques — Modèle 3D Humain Photoréaliste du Bokonon

Ce guide détaille exactement le modèle 3D et les animations requis pour intégrer le véritable prêtre Bokonon cinématographique dans l'application mobile « Au Cœur du Vodun ».

---

## 1. Fichier Principal Attendu
- **Nom exact** : `bokonon.glb`
- **Emplacement** : `frontend/assets/models/bokonon.glb`
- **Format** : **GLTF 2.0 Binaire (`.glb`)** avec squelette, textures PBR et animations embarquées.

---

## 2. Caractéristiques du Modèle Photoréaliste
- **Personnage** :
  - Homme africain d'âge mûr (visage vénérable et expressif, rides de sagesse, regard noble, barbe blanche taillée).
  - Assis en tailleur sur une natte traditionnelle.
  - Vêtu du boubou traditionnel béninois blanc avec broderies sacrées dorées.
  - Coiffe cérémoniale brodée de cauris et double collier de perles rituelles.
- **Topologie & Performance Mobile** :
  - **Polycount recommandé** : 25 000 à 45 000 polygones (triangles) pour garantir un affichage fluide à 60 FPS sur tous les smartphones Android et iOS.
  - **Squelette (Rigging)** : Squelette humanoïde standard (Biped) avec os des doigts et de la tête articulés.
- **Textures PBR** :
  - Résolution : 2048x2048 (2K) au format WebP ou PNG compressé.
  - Canaux : `BaseColor` (couleur et grain de peau ébène), `Normal Map` (reliefs des rides, tissus et broderies), `Roughness` (rugosité de peau et éclat de l'or), `Ambient Occlusion`.

---

## 3. Banques de Modèles 3D Humains Recommandées
1. **CGTrader / Turbosquid** :
   - Recherche : *"Kama - Rigged African Character 3D model animated"* ou *"African Elder Rigged"*.
2. **Sketchfab** :
   - Recherche : *"African traditional priest rigged"*, *"Elder African Character"*.
3. **Reallusion Character Creator 4** :
   - Générateur de visages humains photoréalistes avec morphologie africaine complète.
4. **Unreal Engine MetaHuman** :
   - Création gratuite d'un visage photoréaliste africain puis export du mesh riggé via Blender.

---

## 4. Bibliothèque d'Animations Humaines Réalistes (Mixamo - Adobe, 100% Gratuit)
Sur [mixamo.com](https://www.mixamo.com), importez le modèle (ou téléchargez les clips FBX pour squelette Mixamo) :

| Nom du Clip dans le `.glb` | Animation Mixamo Correspondante | Action du Prêtre |
|---|---|---|
| **`Idle`** | *Sitting Idle* / *Breathing Idle* | Respiration naturelle, légers mouvements de tête et de regard |
| **`Throw`** | *Toss* / *Throwing From Ground* | Mouvement du bras droit qui jette les cauris sur le plateau Opon Ifá |
| **`Point`** | *Reaching Out* / *Spell Cast Forward* | Tête levée face à la caméra, bras tendu paume ouverte vers le spectateur |

---

## 5. Comment assembler et exporter le fichier dans Blender (3 minutes)
1. Téléchargez **Blender** (gratuit sur blender.org).
2. Importez votre personnage et appliquez les 3 animations Mixamo via le **Non-Linear Animation (NLA Editor)** sous les noms `Idle`, `Throw`, `Point`.
3. Cliquez sur **Fichier > Exporter > glTF 2.0 (.glb)**.
4. Dans les options d'export, cochez **Animations** et **Include Selected Objects**.
5. Déposez le fichier obtenu dans ce dossier sous le nom **`bokonon.glb`**.

