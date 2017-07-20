<%!from desktop.views import commonheader, commonfooter %>
<%namespace name="shared" file="shared_components.mako" />

${commonheader("ifrs9", "ifrs9", user, request) | n,unicode}
${shared.menubar(section='mytab')}

## Use double hashes for a mako template comment
## Main body
${commonfooter(request, messages) | n,unicode}
