"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_jwt_extended import JWTManager
import os
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64encode
# from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
# bcrypt = Bcrypt(app)

def set_password(password, salt):
    return generate_password_hash(f"{password}{salt}")

def check_password(hash_password, password, salt):
    return check_password_hash(hash_password, f"{password}{salt}")


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.json
    email = body.get('email')
    password = body.get('password')
    # Verificar si el correo electronico ya existe
    exist_user = User.query.filter_by(email = email).first()
    if exist_user:
        return jsonify({'error': 'este correo ya existe'}), 400
    salt = b64encode(os.urandom(32)).decode("utf-8")
    new_user = User(
        email = email,
        password = set_password(password, salt),
        salt = salt
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg': 'User created succesfully'}), 200

# @api.route("/signup", methods=["POST"])
# def add_user():
#     try:
#         body = request.json
#         print(body)
#         email = body.get("email")
#         password = body.get("password")
#         if email is None or password is None:
#             return jsonify({"msg": "Necesitas proporcionar un email y una contraseña"}), 400
#         user = User.query.filter_by(email=email).first()
#         if user:
#             return jsonify({"msg": "El usuario ya existe"}), 400
#         # Genera un salt aleatorio y codifícalo en base64
#         salt = b64encode(os.urandom(32)).decode("utf-8")
#         # Hashea la contraseña junto con el salt
#         hashed_password = bcrypt.generate_password_hash(password + salt).decode('utf-8')
#         # Crea una instancia de User con el email, la contraseña hasheada y el salt
#         new_user = User(email=email, password=hashed_password, salt=salt)
#         # Agrega el nuevo usuario a la base de datos
#         db.session.add(new_user)
#         db.session.commit()
#         return jsonify({"msg": "Usuario creado exitosamente"}), 200
#     except Exception as error:
#         return jsonify({"error": str(error)}), 500
    

@api.route("/login", methods=["POST"])
def login():

    body = request.json 
    email = body.get("email")
    password = body.get("password")

    if email is None or password is None:
         return jsonify({"msg": "se necesita email y contrasena"}), 400
    
    else: 
        user = User.query.filter_by(email=email).one_or_none()
        
        if user is None: 
            return jsonify({"msg": "credenciales invalidas"}), 400
        
        else:
            if check_password(user.password, password, user.salt):
                token = create_access_token(identity = {
                    "user_id": user.id
                })
                return jsonify({"token": token}), 200
            else: 
                return jsonify({"msg": "credenciales invalidas"}), 400
            
@api.route("/user", methods=["GET"])
@jwt_required()
def get_all_users():
    
    users = User.query.all()
    return jsonify(list(map(lambda item: item.serialize(), users)))

@api.route("/user/<int:theid>", methods=["GET"])
def get_one_user(theid=None):
    user = User.query.get(theid)
    if user is None:
        return jsonify({"msg":"usuario no encontrado"}), 404
    return jsonify(user.serialize())
            
