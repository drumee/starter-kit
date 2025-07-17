$TTL 3D
$ORIGIN <%= domain %>.
;
@       IN      SOA     ns1.<%= domain %>. master.<%= domain %>. (
                        <%= serial %>   ; serial, today date + today serial
                        1H              ; refresh, seconds
                        2H              ; retry, seconds
                        4W              ; expire, seconds
                        1D )            ; minimum, seconds
;
;
@		60	IN  NS      ns1.<%= domain %>.
@		60	IN  NS      ns2.<%= domain %>.
;
<% if (typeof(public_ip4) !== "undefined" && public_ip4 != "" ) { %>
; A records
@		60	IN	A	    <%= public_ip4 %>
ns1		60	IN	A	    <%= public_ip4 %>
ns2		60	IN	A	    <%= public_ip4 %>
smtp	60	IN	A	    <%= public_ip4 %>
jit		60	IN	A	    <%= public_ip4 %>
*		60	IN	A	    <%= public_ip4 %>
;
<% } %>
<% if (typeof(public_ip6) !== "undefined" && public_ip6 != "" ) { %>
; AAAA records
@		60	IN	AAAA	<%= public_ip6 %>
ns1		60	IN	AAAA	<%= public_ip6 %>
ns2		60	IN	AAAA	<%= public_ip6 %>
smtp	60	IN	AAAA	<%= public_ip6 %>
jit		60	IN	AAAA	<%= public_ip6 %>
*		60	IN	AAAA	<%= public_ip6 %>
<% } %>
;
; CNAME
;
www             IN   CNAME  <%= domain %>.
;
; MX records 
;
@               60  IN   MX 10  smtp.<%= domain %>.

; TXT records 
_acme-challenge 60	IN	TXT "acme-challenge"
@               60	IN	TXT "v=spf1 a ~all"
@               60	IN	TXT (<%= dkim_key %>)
;
;
; DKIM 
smtp._domainkey 60  IN  TXT (<%= dkim_key %>)
dkim._domainkey 60  IN  TXT (<%= dkim_key %>)
;
;
; DMARC 
_dmarc          60  IN  TXT "v=DMARC1; p=quarantine;  sp=quarantine; aspf=s"
;
;
; Jitsi subdomain
$ORIGIN <%= jitsi_domain %>.
;
<% if (typeof(public_ip4) !== "undefined" && public_ip4 != "" ) { %>
*		60	IN	A	    <%= public_ip4 %>
<% } %>
<% if (typeof(public_ip6) !== "undefined" && public_ip6 != "" ) { %>
*		60	IN	AAAA	<%= public_ip6 %>
<% } %>
;
; TXT records 
_acme-challenge 60	IN	TXT	"jit-acme-challenge"

