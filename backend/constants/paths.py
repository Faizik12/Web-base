import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')
FRONTEND_BUILD_DIR = os.path.join(FRONTEND_DIR, 'build')
