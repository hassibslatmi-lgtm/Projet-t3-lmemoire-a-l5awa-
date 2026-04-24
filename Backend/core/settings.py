"""
Django settings for core project.
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-!+w(!8yt7lx2ecojmcs%#8x=a=y(*!z$uy#ncm_9t@g@zzc_#('

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Libraries
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',

    # My Apps
    'users',
    'products',
    'orders',
    'notifications',
]

CORS_ALLOW_ALL_ORIGINS = True

AUTH_USER_MODEL = 'users.User'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'agrigov_db',
        'USER': 'root',          
        'PASSWORD': 'Vlvbrl25',  
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Django REST Framework Configuration
# settings.py

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication', # هذا اللي رانا نخدمو بيه في React
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny', # غيرها من IsAuthenticated لـ AllowAny
    ],
}

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript)
STATIC_URL = 'static/'

# ─── MEDIA FILES CONFIGURATION (هنا التعديل اللي كان ناقصك) ───────────────────
# الرابط الذي يظهر في المتصفح للوصول للصور
MEDIA_URL = '/media/'
# المجلد الحقيقي في جهازك الذي ستحفظ فيه الصور
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# ──────────────────────────────────────────────────────────────────────────────

# Emails
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'agrigivaha@gmail.com' 
EMAIL_HOST_PASSWORD = 'hcaknkevjrsjokqq'   

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# payment api
# CHARGILY_KEY = "test_pk_9yUaWCioOTEAQ9IMH5IfNByGmQ3QmvA0P4AIWf4u"
CHARGILY_SECRET_KEY = "test_sk_DFcGt3l8cMNz9RqYcA7y59L1DlGrrREqrepUyNbk"
CHARGILY_BASE_URL = "https://pay.chargily.net/test/api/v2"