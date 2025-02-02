from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'surveys', views.SurveyViewSet)
router.register(r'media-items', views.MediaItemViewSet)
router.register(r'users', views.UserProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
]

# 添加调试输出
print("Available URLs:")
for url in router.urls:
    print(f"- {url.pattern}") 