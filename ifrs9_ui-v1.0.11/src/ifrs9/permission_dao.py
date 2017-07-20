from desktop.decorators import hue_permission_required
from desktop.lib.exceptions_renderable import PopupException

"""
    This function checks if the current user has the custom permission for the application IFRS9
"""
def check_permission(request, id_p):
    return check_permission_app(request, id_p, "ifrs9")

def check_permission_app(request, id_p, app):
    try:
        return request.user.has_hue_permission(id_p, app)
    except PopupException as e:
        return False

def get_permission_context(request):
    permissionContext = {}

    for k in ['anr', 'anw', 'per', 'pew', 'por', 'pow']:
        permissionContext[k] = check_permission(request, k)

    return permissionContext
