const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
 
const db = mysql.createConnection({
    host: 'localhost',  // hôte, en général 'localhost' pour phpMyAdmin local
    user: 'root',       // ton nom d'utilisateur MySQL
    password: 'teo',    // ton mot de passe MySQL
    database: 'restaurantapi',  //Remplace par le nom de ta base de données
});
 
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});
 
app.get('/categories', (req, res) => {
    const sql = 'SELECT * FROM categories';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des catégories:', err);
            res.status(500).send('Erreur lors de la récupération des catégories');
            return;
        }
        res.json(result);
    });
}
);
 
app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});
const users = {
    admin: { password: 'admin1234', role: 'admin' },
    client: { password: 'client1234', role: 'client' }
  };
 
 db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
 });//
 const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('NON AUTORISE');
    }
    const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
        .toString()
        .split(':');
    const user = users[username];
    if (!user || user.password !== password) {
        return res.status(403).send('ACCES INTERDIT');
    }
    req.user = user; // Attach user to the request
    next();
 };
 // Role-based Access Control Middleware
 const authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).send('ACCES INTERDIT');
        }
        next();
    };
 };

// Pour utiliser le middleware JSON
app.use(express.json());

// Route pour récupérer un item par ID
app.get('/item/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM item WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'item:', err);
            res.status(500).send('Erreur lors de la récupération de l\'item');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Item non trouvé');
        } else {
            res.json(result[0]);
        }
    });
});

 
// Route pour ajouter un nouvel item (admin uniquement)
app.post('/item', basicAuth, authorize('admin'), (req, res) => {
    const { id, name, price, description, category_id } = req.body;  // Adapte en fonction des colonnes de ta table
    const sql = 'INSERT INTO item (id, name, price, description, category_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [id, name, price, description, category_id], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de l\'item:', err);
            res.status(500).send('Erreur lors de l\'ajout de l\'item');
            return;
        }
        res.status(201).json({ message: 'Item ajouté avec succès', itemId: result.insertId });
    });
});
 
// Route pour mettre à jour un item par ID (admin uniquement)
app.put('/item/:id', basicAuth, authorize('admin'), (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const sql = 'UPDATE item SET name = ?, price = ?, description = ? WHERE id = ?';
    db.query(sql, [name, price, description, id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de l\'item:', err);
            res.status(500).send('Erreur lors de la mise à jour de l\'item');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Item non trouvé');
        } else {
            res.json({ message: 'Item mis à jour avec succès' });
        }
    });
});

// Route pour supprimer un item par ID (admin uniquement)
app.delete('/item/:id', basicAuth, authorize('admin'), (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM item WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de l\'item:', err);
            res.status(500).send('Erreur lors de la suppression de l\'item');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Item non trouvé');
        } else {
            res.json({ message: 'Item supprimé avec succès' });
        }
    });
});

// Route pour récupérer une categorie par ID
app.get('/categories/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM categories WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'categories:', err);
            res.status(500).send('Erreur lors de la récupération de l\'categories');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('categorie non trouvée');
        } else {
            res.json(result[0]);
        }
    });
});

// Route pour ajouter une nouvelle categorie (admin uniquement)
app.post('/categories', basicAuth, authorize('admin'), (req, res) => {
    const { id, name } = req.body;  // Adapte en fonction des colonnes de ta table
    const sql = 'INSERT INTO categories (id, name) VALUES (?, ?)';
    db.query(sql, [id, name], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de l\'item:', err);
            res.status(500).send('Erreur lors de l\'ajout de l\'item');
            return;
        }
        res.status(201).json({ message: 'categorie ajoutée avec succès', categoriesId: result.insertId });
    });
});

// Route pour mettre à jour une categorie par ID (admin uniquement)
app.put('/categories/:id', basicAuth, authorize('admin'), (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const sql = 'UPDATE categories SET name = ? WHERE id = ?';
    db.query(sql, [name, id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de l\'categories:', err);
            res.status(500).send('Erreur lors de la mise à jour de l\'categories');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('categorie non trouvée');
        } else {
            res.json({ message: 'categorie mise à jour avec succès' });
        }
    });
});
 
// Route pour supprimer une categorie par ID (admin uniquement)
app.delete('/categories/:id', basicAuth, authorize('admin'), (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM categories WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de l\'categories:', err);
            res.status(500).send('Erreur lors de la suppression de l\'categories');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('categorie non trouvée');
        } else {
            res.json({ message: 'categorie supprimée avec succès' });
        }
    });
});

// Route pour récupérer formulas par ID
app.get('/formulas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM formulas WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'formulas:', err);
            res.status(500).send('Erreur lors de la récupération de l\'formulas');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Formula non trouvée');
        } else {
            res.json(result[0]);
        }
    });
});

// Route pour ajouter une nouvelle formula (admin uniquement)
app.post('/formulas', basicAuth, authorize('admin'), (req, res) => {
    const { name, price, categories } = req.body;  // Adapte en fonction des colonnes de ta table
    const sql = 'INSERT INTO formulas (name, price, categories) VALUES (?, ?, ?)';
    db.query(sql, [name, price, categories], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de l\'formulas:', err);
            res.status(500).send('Erreur lors de l\'ajout de l\'formulas');
            return;
        }
        res.status(201).json({ message: 'formula ajoutée avec succès', formulasId: result.insertId });
    });
});
 
// Route pour mettre à jour une formula par ID (admin uniquement)
app.put('/formulas/:id', basicAuth, authorize('admin'), (req, res) => {
    const { id } = req.params;
    const { name, price, categories } = req.body;
    const sql = 'UPDATE formulas SET name = ?, price = ?, categories = ? WHERE id = ?';
    db.query(sql, [name, price, categories, id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de l\'formulas:', err);
            res.status(500).send('Erreur lors de la mise à jour de l\'formulas');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('formula non trouvée');
        } else {
            res.json({ message: 'formula mise à jour avec succès' });
        }
    });
});
 
// Route pour supprimer une formila par ID (admin uniquement)
app.delete('/formulas/:id', basicAuth, authorize('admin') , (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM formulas WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de l\'formulas:', err);
            res.status(500).send('Erreur lors de la suppression de l\'formulas');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('formula non trouvée');
        } else {
            res.json({ message: 'formula supprimée avec succès' });
        }
    });
});

// Route pour filtrer et avoir tous les items
app.get('/item', (req, res) => {
    const { name, price, description, category_id } = req.query;
    // Début de la requête SQL
    let sql = 'SELECT * FROM item WHERE 1=1';
    const params = [];
 
    // Ajout des filtres
    if (name) {
        sql += ' AND name LIKE ?';
        params.push(`%${name}%`);
    }
    if (price) {
        sql += ' AND price = ?';
        params.push(price);
    }
    if (description) {
        sql += ' AND description LIKE ?';
        params.push(`%${description}%`);
    }
    if (category_id) {
        sql += ' AND category_id = ?';
        params.push(category_id);
    }
 
    // Exécution de la requête
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des item:', err);
            res.status(500).send('Erreur lors de la récupération des item');
            return;
        }
 
        // Envoi du résultat en JSON
        res.json(results);
    });
});


   // Route pour filtrer les formulas(get-parameters)
   app.get('/formulas', (req, res) => {
    const { name, price, categories } = req.query;
    // Début de la requête SQL
    let sql = 'SELECT * FROM formulas WHERE 1=1';
    const params = [];
    // Ajout des filtres
    if (name) {
        sql += ' AND name LIKE ?';
        params.push(`%${name}%`);
    }
    if (price) {
        sql += ' AND price = ?';
        params.push(price);
    }
    if (categories) {
        sql += ' AND categories = ?';
        params.push(categories);
    }
    // Exécution de la requête
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des formulas:', err);
            res.status(500).send('Erreur lors de la récupération des formulas');
            return;
        }
        res.json(results);
    });
});
 