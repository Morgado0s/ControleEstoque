from categories.routes import blueprint as categories_blueprint
from warehouses.routes import blueprint as warehouses_blueprint
from products.routes import blueprint as products_blueprint
from entries.routes import blueprint as entries_blueprint
from exits.routes import blueprint as exits_blueprint
from users.routes import blueprint as users_blueprint
from gender.routes import blueprint as gender_blueprint
from roles.routes import blueprint as roles_blueprint

def register_blueprints(app):
    app.register_blueprint(categories_blueprint, url_prefix='/categories')
    app.register_blueprint(warehouses_blueprint, url_prefix='/warehouses')
    app.register_blueprint(products_blueprint, url_prefix='/products')
    app.register_blueprint(entries_blueprint, url_prefix='/entries')
    app.register_blueprint(exits_blueprint, url_prefix='/exits')
    app.register_blueprint(users_blueprint, url_prefix='/users')
    app.register_blueprint(gender_blueprint, url_prefix='/gender')
    app.register_blueprint(roles_blueprint, url_prefix='/roles')