/* BLONDZ PRO USA — «My club» (/blondz-pro/my-club/). Usa la API de mi.js del Worker:
   entrar (correo → código de 6 dígitos) · verificar (→ token, se guarda en localStorage «gp_token») · yo · idioma ·
   pedir · publicacion · mision · canjear · sugerencia · spark · meta · salir.
   Los errores del servidor se muestran tal como llegan (ya traducidos). Un 401 la devuelve a «entrar».
   Los textos fijos están aquí en T.en / T.es; los del servidor (títulos, misiones...) llegan en el idioma de la
   creadora, así que al cambiar EN | ES se guarda en el Worker (POST /api/idioma) y se vuelve a pedir /api/yo.
   Depende de girlz-pro.js (window.GP). Debe andar en iPhone con Brave (WebKit): nada de lookbehind. */
(function () {
  "use strict";
  var GP = window.GP;
  var app = document.getElementById("gp-app");
  var vivo = document.getElementById("gp-vivo");
  if (!GP || !app) return;
  var esc = GP.esc;

  // ---------- textos ----------
  var T = {
    en: {
      cargando: "Loading your club...",
      entrar_t: "Sign in to My club",
      entrar_p: "Enter the email you applied with. We'll send you a 6-digit code to sign in, no password needed.",
      correo: "Email",
      enviar_codigo: "Send me a code",
      no_club: "Not in the club yet?",
      postulate: "Apply here",
      codigo_t: "Check your email",
      codigo_p: "If {correo} is in the club, we just sent it a 6-digit code. It expires in 10 minutes. Check your spam folder too.",
      codigo: "6-digit code",
      codigo_prueba: "Test mode: your code is {codigo}",
      entrar_btn: "Sign in",
      otro_correo: "Use another email",
      reenviar: "Send a new code",
      reenviado: "We sent you a new code.",
      error_t: "We couldn't load your club",
      reintentar: "Try again",
      hola: "Hi, {nombre}",
      salir: "Sign out",
      estrellas: "stars",
      estrella: "star",
      tu_saldo: "Your stars",
      nivel: "Level",
      por_mes: "{n} products a month",
      por_mes_1: "1 product a month",
      este_mes: "{usados} of {max} used this month",
      faltan: "{n} more approved posts to reach {nivel}",
      faltan_1: "1 more approved post to reach {nivel}",
      tope_nivel: "You're at the top level. Thank you for creating with us!",
      progreso: "Progress to the next level",
      vencen: "{n} stars expire on {fecha}.",
      vencen_1: "1 star expires on {fecha}.",
      canjealas: "Redeem them",
      tab_productos: "Products",
      tab_misiones: "Missions",
      tab_canjear: "Redeem stars",
      tab_invitar: "Invite",
      tab_historial: "History",
      tabs: "My club sections",
      drops_t: "Open drops",
      drops_guia_t: "How drops work",
      drops_guia: "Pick a product, choose the shade and confirm your US address. Amazon ships it to you. Post before the deadline and paste the link here.",
      reglas_guia: "Always use #ad or the Paid partnership label and tag the brand. No prices, and never ask for or leave Amazon reviews of club products.",
      sin_drops: "No drops are open right now. We'll email you as soon as a new one opens.",
      no_pedir_enlace: "Paste the link for {productos} to order again.",
      no_pedir_sin_publicar: "You have {n} products without a link. Post about them and paste the links here to order more.",
      no_pedir_mes: "You've used this month's products ({max} of {max}). You can order again next month.",
      no_pedir_anual: "You've reached this year's product limit. Thank you for all your content!",
      no_pedir: "You can't order right now.",
      tu_mision: "Your mission:",
      etiqueta: "Tag:",
      plazo: "Post within {n} days of shipping",
      abierto_hasta: "Open until {fecha}",
      quedan: "Only {n} left",
      unidades: "{n} units",
      elegir: "Choose this product",
      ya_pedido: "Already ordered",
      agotado: "Sold out",
      no_disponible: "Not available yet",
      fotos_de: "Photos of {titulo}",
      foto_n: "{titulo}, photo {n} of {m}",
      foto_ant: "Previous photo",
      foto_sig: "Next photo",
      elige_tono: "Choose the shade",
      elige_tono_n: "Unit {n}: choose the shade",
      sin_tono: "Choose a shade for each unit.",
      agotada: "sold out",
      dir_t: "Ship to",
      nombre_envio: "Full name",
      linea1: "Street address",
      linea2: "Apt, suite or unit",
      ciudad: "City",
      estado_us: "State",
      elige_estado: "Choose your state",
      zip: "ZIP code",
      telefono: "Phone",
      opcional: "(optional)",
      tel_ayuda: "Only for the carrier, if they need to reach you.",
      dir_nota: "We ship only to US street addresses. No PO Box or APO/FPO/DPO.",
      confirmar_pedido: "Confirm order",
      cancelar: "Cancel",
      pedido_ok: "Done! We'll email you when it ships.",
      mis_productos: "My products",
      sin_pedidos: "You haven't ordered any products yet.",
      tono: "Shade:",
      tonos: "Shades:",
      pedido_el: "Ordered:",
      envio_a: "Ship to:",
      guia: "Tracking:",
      llega: "Arrives around {fecha}",
      publica_antes: "Post by {fecha}",
      mision_l: "Mission:",
      e_pedido: "Ordered",
      e_aprobando: "Preparing",
      e_aprobado: "Preparing",
      e_enviado: "Shipped",
      e_devuelto: "Sent back",
      e_revisar: "In review",
      e_publicado: "Approved",
      e_vencido: "Overdue",
      e_cancelado: "Canceled",
      t_pedido: "We're reviewing your order. We'll email you when it ships.",
      t_preparando: "Your order is approved. Amazon is preparing the package.",
      t_enviado: "When you post, paste the link here.",
      t_devuelto: "We sent your post back:",
      t_devuelto_2: "Fix it and paste the link again.",
      t_vencido: "The deadline to post has passed. Post it and paste the link as soon as you can: you can't order more products until you do.",
      t_revisar: "We're reviewing your post.",
      t_publicado: "Approved. Thank you for your post!",
      t_cancelado: "This order was canceled.",
      ver_publicacion: "See your post",
      pega_enlace: "Paste the link to your post",
      cambia_enlace: "Replace the link",
      enviar_enlace: "Send link",
      enlace_malo: "Paste the full link of your Instagram or TikTok post. It starts with https://",
      enlace_ok: "Link received. We'll review your post and email you.",
      ref_btn: "Watch the reference video",
      ref_nota: "It's a guide, it doesn't have to look the same. Make it your way.",
      spark_t: "Earn {n} more stars with Spark Ads",
      spark_p: "A Spark Ads code lets us run your TikTok as an ad from your account. It has to be valid for {dias} days or more.",
      spark_1: "Open your video on TikTok and tap the three dots (or Share).",
      spark_2: "Tap Ad settings and turn on Ad authorization.",
      spark_3: "Tap Generate code, choose {dias} days or more and confirm.",
      spark_4: "Copy the code (it starts with #) and paste it here.",
      spark_codigo: "Spark Ads code",
      spark_enviar: "Send code",
      spark_malo: "Paste the whole code. It starts with # and is long.",
      spark_no: "That code didn't work. Generate a new one and try again.",
      spark_revisando: "We received your Spark Ads code and we're checking it.",
      spark_valido: "Spark Ads code accepted.",
      spark_hasta: "Valid until {fecha}.",
      spark_ok_suma: "Code accepted. +{n} stars!",
      spark_ok: "Code accepted. The {n} stars are added when your post is approved.",
      spark_ok_revisar: "Code received. We'll check it and add your stars.",
      bono_al_aprobar: "The {n} stars are added when your post is approved.",
      bono_sumado: "+{n} stars added.",
      meta_t: "Earn {n} more stars with a partnership ad",
      meta_p: "Give @blondzonlyus permission to run your post as a partnership ad on Instagram.",
      meta_1: "Open your post on Instagram, tap the three dots and choose Edit.",
      meta_2: "Tap Partnership label and ads and add @blondzonlyus as brand partner.",
      meta_3: "Turn on Partnership ads (it may say Allow brand partner to boost) and save.",
      meta_4: "Come back here and tap the button.",
      meta_btn: "I already gave partnership ad permission",
      meta_no: "We couldn't find the permission. Check the steps and try again.",
      meta_dijo: "Thanks! We're confirming your partnership ad permission.",
      meta_valido: "Partnership ad permission confirmed.",
      meta_ok: "Thanks! We'll confirm it and add the {n} stars.",
      misiones_t: "Missions",
      misiones_guia: "Missions are extra briefs with their own stars. Read the brief, post, and paste the link here. We review every post by hand.",
      sin_misiones: "No missions are open right now. New ones show up here and in your email.",
      sin_producto: "No product needed",
      con_el_tuyo: "With one you already have",
      f_todas: "All",
      f_orden: "Sort missions",
      o_sugerido: "What you can do first",
      o_mas: "Most stars first",
      o_menos: "Fewest stars first",
      sin_filtro: "No missions match this filter.",
      hasta: "Until {fecha}",
      requisitos: "What it needs",
      cumple: "My post does what the mission asks, uses #ad and tags the brand.",
      cumple_bio: "My bio does what the mission asks and mentions the brand.",
      cumple_falta: "Check this box to send your link.",
      m_revisar: "In review",
      m_aprobada: "Approved, +{n} stars",
      m_rechazada: "Not approved:",
      m_rechazada_2: "You can fix it and send the link again.",
      m_cerrada: "This mission is closed.",
      m_llena: "This mission is full.",
      mision_ok: "Link received. We'll review it and email you.",
      canjear_t: "Redeem your stars",
      canjear_guia: "You have {n} stars. Choose a product and we'll ship it to your US address. Stars have no cash value and expire 12 months after you earn them.",
      sin_recompensas: "There are no rewards available right now. Check back soon.",
      canjear_btn: "Redeem",
      te_faltan: "{n} more stars needed",
      te_faltan_1: "1 more star needed",
      canje_resumen: "You'll use {n} stars and have {quedan} left.",
      confirmar_canje: "Confirm and redeem",
      canje_ok: "Done! We'll email you when it ships.",
      mis_canjes: "My redemptions",
      sin_canjes: "You haven't redeemed any stars yet.",
      c_pedido: "Requested",
      c_cancelado: "Canceled. Your stars were returned.",
      invitar_t: "Invite a creator",
      tu_codigo: "Your invite code",
      invitar_p: "When a creator applies with your link and we approve her, you get {n} stars.",
      tu_enlace: "Your link",
      copiar_enlace: "Copy link",
      copiar_codigo: "Copy code",
      compartir: "Share",
      compartir_texto: "Join BLONDZ PRO, the creator club of Blondz Only and Girlz Only:",
      copiado: "Copied!",
      invitar_req: "She must live in the US, be 18 or older and have 1,000+ followers on Instagram or TikTok.",
      sin_codigo: "Your invite code will show up here soon.",
      historial_t: "Star history",
      bono_t: "Cash bonus for views",
      bono_p: "When a reel or TikTok you post for the club passes {vistas} views in its first {dias} days, we pay you US${usd}, on top of your stars. One bonus per video. We check the views ourselves and email you when you earn it.",
      bono_sin: "Your cash bonuses will show up here.",
      bono_vistas: "{n} views",
      bono_por_pagar: "Earned {fecha}. We'll email you to arrange the payment.",
      bono_pagado: "Paid {fecha}",
      sin_movs: "Your stars will show up here as soon as we approve your first post.",
      mv_publicacion: "Approved post",
      mv_mision: "Mission",
      mv_spark: "Spark Ads bonus",
      mv_meta: "Partnership ad bonus",
      mv_referida: "Creator you invited",
      mv_canje: "Redeemed",
      mv_reembolso: "Stars returned",
      mv_vencimiento: "Expired stars",
      mv_bono: "Bonus",
      mv_ajuste: "Adjustment",
      buzon_t: "Suggestion box",
      buzon_p: "Ideas for products, missions or the club? We read every message.",
      tu_idea: "Your suggestion",
      enviar_idea: "Send suggestion",
      idea_ok: "Thanks! We got your suggestion.",
      idea_corta: "Write a little more so we can understand your idea.",
      s_nueva: "Sent",
      s_vista: "Read",
      s_hecha: "Done",
      respuesta: "Our answer:",
      ayuda: "Questions? Write to",
      vencida: "Your session ended. Request a new code to sign in.",
    },
    es: {
      cargando: "Cargando tu club...",
      entrar_t: "Entra a My club",
      entrar_p: "Escribe el correo con el que te postulaste. Te enviaremos un código de 6 dígitos para entrar, sin contraseña.",
      correo: "Correo",
      enviar_codigo: "Enviarme un código",
      no_club: "¿Todavía no estás en el club?",
      postulate: "Postúlate aquí",
      codigo_t: "Revisa tu correo",
      codigo_p: "Si {correo} está en el club, le acabamos de enviar un código de 6 dígitos. Vence en 10 minutos. Revisa también la carpeta de spam.",
      codigo: "Código de 6 dígitos",
      codigo_prueba: "Modo de prueba: tu código es {codigo}",
      entrar_btn: "Entrar",
      otro_correo: "Usar otro correo",
      reenviar: "Enviar un código nuevo",
      reenviado: "Te enviamos un código nuevo.",
      error_t: "No pudimos cargar tu club",
      reintentar: "Intentar de nuevo",
      hola: "Hola, {nombre}",
      salir: "Salir",
      estrellas: "estrellas",
      estrella: "estrella",
      tu_saldo: "Tus estrellas",
      nivel: "Nivel",
      por_mes: "{n} productos al mes",
      por_mes_1: "1 producto al mes",
      este_mes: "{usados} de {max} usados este mes",
      faltan: "Te faltan {n} publicaciones aprobadas para llegar a {nivel}",
      faltan_1: "Te falta 1 publicación aprobada para llegar a {nivel}",
      tope_nivel: "Estás en el nivel más alto. ¡Gracias por crear con nosotras!",
      progreso: "Avance al siguiente nivel",
      vencen: "{n} estrellas vencen el {fecha}.",
      vencen_1: "1 estrella vence el {fecha}.",
      canjealas: "Canjéalas",
      tab_productos: "Productos",
      tab_misiones: "Misiones",
      tab_canjear: "Canjear estrellas",
      tab_invitar: "Invitar",
      tab_historial: "Historial",
      tabs: "Secciones de My club",
      drops_t: "Drops abiertos",
      drops_guia_t: "Cómo funcionan los drops",
      drops_guia: "Elige un producto, escoge el tono y confirma tu dirección en EE. UU. Amazon te lo envía. Publica antes del plazo y pega el enlace aquí.",
      reglas_guia: "Usa siempre #ad o la etiqueta de colaboración pagada y etiqueta a la marca. Sin precios, y nunca pidas ni dejes reseñas en Amazon de productos del club.",
      sin_drops: "No hay drops abiertos ahora. Te escribiremos apenas se abra uno nuevo.",
      no_pedir_enlace: "Pega el enlace de {productos} para volver a pedir.",
      no_pedir_sin_publicar: "Tienes {n} productos sin enlace. Publícalos y pega los enlaces aquí para pedir más.",
      no_pedir_mes: "Ya usaste los productos de este mes ({max} de {max}). El próximo mes puedes volver a pedir.",
      no_pedir_anual: "Llegaste al límite de productos de este año. ¡Gracias por todo tu contenido!",
      no_pedir: "Ahora no puedes pedir.",
      tu_mision: "Tu misión:",
      etiqueta: "Etiqueta:",
      plazo: "Publica en {n} días desde que sale",
      abierto_hasta: "Abierto hasta el {fecha}",
      quedan: "Solo quedan {n}",
      unidades: "{n} unidades",
      elegir: "Elegir este producto",
      ya_pedido: "Ya lo pediste",
      agotado: "Agotado",
      no_disponible: "Todavía no disponible",
      fotos_de: "Fotos de {titulo}",
      foto_n: "{titulo}, foto {n} de {m}",
      foto_ant: "Foto anterior",
      foto_sig: "Foto siguiente",
      elige_tono: "Escoge el tono",
      elige_tono_n: "Unidad {n}: escoge el tono",
      sin_tono: "Escoge un tono para cada unidad.",
      agotada: "agotado",
      dir_t: "Enviar a",
      nombre_envio: "Nombre completo",
      linea1: "Dirección",
      linea2: "Apto, suite o unidad",
      ciudad: "Ciudad",
      estado_us: "Estado",
      elige_estado: "Elige tu estado",
      zip: "Código ZIP",
      telefono: "Teléfono",
      opcional: "(opcional)",
      tel_ayuda: "Solo para la transportadora, por si necesita contactarte.",
      dir_nota: "Solo enviamos a direcciones físicas en EE. UU. Sin PO Box ni APO/FPO/DPO.",
      confirmar_pedido: "Confirmar pedido",
      cancelar: "Cancelar",
      pedido_ok: "¡Listo! Te escribiremos cuando salga.",
      mis_productos: "Mis productos",
      sin_pedidos: "Todavía no has pedido productos.",
      tono: "Tono:",
      tonos: "Tonos:",
      pedido_el: "Pedido:",
      envio_a: "Enviar a:",
      guia: "Guía:",
      llega: "Llega alrededor del {fecha}",
      publica_antes: "Publica antes del {fecha}",
      mision_l: "Misión:",
      e_pedido: "Pedido",
      e_aprobando: "Preparando",
      e_aprobado: "Preparando",
      e_enviado: "Enviado",
      e_devuelto: "Devuelta",
      e_revisar: "En revisión",
      e_publicado: "Aprobada",
      e_vencido: "Vencido",
      e_cancelado: "Cancelado",
      t_pedido: "Estamos revisando tu pedido. Te escribiremos cuando salga.",
      t_preparando: "Tu pedido está aprobado. Amazon está preparando el paquete.",
      t_enviado: "Cuando publiques, pega el enlace aquí.",
      t_devuelto: "Te devolvimos la publicación:",
      t_devuelto_2: "Corrígela y vuelve a pegar el enlace.",
      t_vencido: "Ya pasó el plazo para publicar. Publica y pega el enlace lo antes posible: no puedes pedir más productos hasta hacerlo.",
      t_revisar: "Estamos revisando tu publicación.",
      t_publicado: "Aprobada. ¡Gracias por tu publicación!",
      t_cancelado: "Este pedido se canceló.",
      ver_publicacion: "Ver tu publicación",
      pega_enlace: "Pega el enlace de tu publicación",
      cambia_enlace: "Cambiar el enlace",
      enviar_enlace: "Enviar enlace",
      enlace_malo: "Pega el enlace completo de tu publicación de Instagram o TikTok. Empieza con https://",
      enlace_ok: "Recibimos el enlace. Revisaremos tu publicación y te escribiremos.",
      ref_btn: "Ver el video de referencia",
      ref_nota: "Es una guía, no tiene que quedar igual. Hazlo a tu estilo.",
      spark_t: "Gana {n} estrellas más con Spark Ads",
      spark_p: "Un código de Spark Ads nos permite usar tu TikTok como anuncio desde tu cuenta. Debe tener una vigencia de {dias} días o más.",
      spark_1: "Abre tu video en TikTok y toca los tres puntos (o Compartir).",
      spark_2: "Toca Configuración de anuncios y activa Autorización de anuncios.",
      spark_3: "Toca Generar código, elige {dias} días o más y confirma.",
      spark_4: "Copia el código (empieza con #) y pégalo aquí.",
      spark_codigo: "Código de Spark Ads",
      spark_enviar: "Enviar código",
      spark_malo: "Pega el código completo. Empieza con # y es largo.",
      spark_no: "Ese código no funcionó. Genera uno nuevo e intenta otra vez.",
      spark_revisando: "Recibimos tu código de Spark Ads y lo estamos revisando.",
      spark_valido: "Código de Spark Ads aceptado.",
      spark_hasta: "Vigente hasta el {fecha}.",
      spark_ok_suma: "Código aceptado. ¡+{n} estrellas!",
      spark_ok: "Código aceptado. Las {n} estrellas se suman cuando aprobemos tu publicación.",
      spark_ok_revisar: "Recibimos el código. Lo revisaremos y sumaremos tus estrellas.",
      bono_al_aprobar: "Las {n} estrellas se suman cuando aprobemos tu publicación.",
      bono_sumado: "+{n} estrellas sumadas.",
      meta_t: "Gana {n} estrellas más con un anuncio de colaboración",
      meta_p: "Dale permiso a @blondzonlyus para usar tu publicación como anuncio de colaboración en Instagram.",
      meta_1: "Abre tu publicación en Instagram, toca los tres puntos y elige Editar.",
      meta_2: "Toca Etiqueta de colaboración y anuncios y agrega a @blondzonlyus como marca asociada.",
      meta_3: "Activa Anuncios de colaboración (puede decir Permitir que la marca asociada promocione) y guarda.",
      meta_4: "Vuelve aquí y toca el botón.",
      meta_btn: "Ya di el permiso de anuncio de colaboración",
      meta_no: "No encontramos el permiso. Revisa los pasos e intenta otra vez.",
      meta_dijo: "¡Gracias! Estamos confirmando tu permiso de anuncio de colaboración.",
      meta_valido: "Permiso de anuncio de colaboración confirmado.",
      meta_ok: "¡Gracias! Lo confirmaremos y sumaremos las {n} estrellas.",
      misiones_t: "Misiones",
      misiones_guia: "Las misiones son encargos extra con sus propias estrellas. Lee el encargo, publica y pega el enlace aquí. Revisamos cada publicación a mano.",
      sin_misiones: "No hay misiones abiertas ahora. Las nuevas aparecen aquí y en tu correo.",
      sin_producto: "Sin producto",
      con_el_tuyo: "Con el que ya tienes",
      f_todas: "Todas",
      f_orden: "Ordenar misiones",
      o_sugerido: "Primero las que puedes hacer",
      o_mas: "Más estrellas primero",
      o_menos: "Menos estrellas primero",
      sin_filtro: "No hay misiones con este filtro.",
      hasta: "Hasta el {fecha}",
      requisitos: "Qué debe tener",
      cumple: "Mi publicación cumple lo que pide la misión, usa #ad y etiqueta a la marca.",
      cumple_bio: "Mi bio cumple lo que pide la misión y menciona a la marca.",
      cumple_falta: "Marca esta casilla para enviar tu enlace.",
      m_revisar: "En revisión",
      m_aprobada: "Aprobada, +{n} estrellas",
      m_rechazada: "No aprobada:",
      m_rechazada_2: "Puedes corregirla y enviar el enlace otra vez.",
      m_cerrada: "Esta misión ya cerró.",
      m_llena: "Esta misión ya está llena.",
      mision_ok: "Recibimos el enlace. Lo revisaremos y te escribiremos.",
      canjear_t: "Canjea tus estrellas",
      canjear_guia: "Tienes {n} estrellas. Elige un producto y te lo enviamos a tu dirección en EE. UU. Las estrellas no tienen valor en dinero y vencen 12 meses después de ganarlas.",
      sin_recompensas: "No hay productos para canjear ahora. Vuelve pronto.",
      canjear_btn: "Canjear",
      te_faltan: "Te faltan {n} estrellas",
      te_faltan_1: "Te falta 1 estrella",
      canje_resumen: "Usarás {n} estrellas y te quedarán {quedan}.",
      confirmar_canje: "Confirmar y canjear",
      canje_ok: "¡Listo! Te escribiremos cuando salga.",
      mis_canjes: "Mis canjes",
      sin_canjes: "Todavía no has canjeado estrellas.",
      c_pedido: "Pedido",
      c_cancelado: "Cancelado. Te devolvimos las estrellas.",
      invitar_t: "Invita a una creadora",
      tu_codigo: "Tu código de invitación",
      invitar_p: "Cuando una creadora se postula con tu enlace y la aprobamos, ganas {n} estrellas.",
      tu_enlace: "Tu enlace",
      copiar_enlace: "Copiar enlace",
      copiar_codigo: "Copiar código",
      compartir: "Compartir",
      compartir_texto: "Únete a BLONDZ PRO, el club de creadoras de Blondz Only y Girlz Only:",
      copiado: "¡Copiado!",
      invitar_req: "Debe vivir en EE. UU., tener 18 años o más y 1,000+ seguidores en Instagram o TikTok.",
      sin_codigo: "Tu código de invitación aparecerá aquí pronto.",
      historial_t: "Historial de estrellas",
      bono_t: "Bono en efectivo por vistas",
      bono_p: "Cuando un reel o TikTok que publicas para el club pasa las {vistas} vistas en sus primeros {dias} días, te pagamos US${usd}, además de tus estrellas. Un bono por video. Las vistas las revisamos nosotras y te escribimos cuando lo ganas.",
      bono_sin: "Aquí vas a ver tus bonos en efectivo.",
      bono_vistas: "{n} vistas",
      bono_por_pagar: "Ganado el {fecha}. Te escribimos para coordinar el pago.",
      bono_pagado: "Pagado el {fecha}",
      sin_movs: "Tus estrellas aparecerán aquí apenas aprobemos tu primera publicación.",
      mv_publicacion: "Publicación aprobada",
      mv_mision: "Misión",
      mv_spark: "Bono de Spark Ads",
      mv_meta: "Bono de anuncio de colaboración",
      mv_referida: "Creadora que invitaste",
      mv_canje: "Canje",
      mv_reembolso: "Estrellas devueltas",
      mv_vencimiento: "Estrellas vencidas",
      mv_bono: "Bono",
      mv_ajuste: "Ajuste",
      buzon_t: "Buzón de sugerencias",
      buzon_p: "¿Ideas de productos, misiones o del club? Leemos cada mensaje.",
      tu_idea: "Tu sugerencia",
      enviar_idea: "Enviar sugerencia",
      idea_ok: "¡Gracias! Recibimos tu sugerencia.",
      idea_corta: "Escribe un poco más para entender tu idea.",
      s_nueva: "Enviada",
      s_vista: "Leída",
      s_hecha: "Hecha",
      respuesta: "Nuestra respuesta:",
      ayuda: "¿Preguntas? Escribe a",
      vencida: "Tu sesión terminó. Pide un código nuevo para entrar.",
    },
  };
  var MOTIVOS = {
    no_carga: { en: "We couldn't open the link", es: "No pudimos abrir el enlace" },
    sin_etiqueta: { en: "The brand account isn't tagged", es: "Falta etiquetar la cuenta de la marca" },
    sin_ad: { en: "It's missing #ad or the Paid partnership label", es: "Falta #ad o la etiqueta de colaboración pagada" },
    no_producto: { en: "The product isn't clearly shown", es: "No se ve bien el producto" },
    no_mision: { en: "It doesn't match the mission", es: "No corresponde a la misión" },
    borrada: { en: "The post was deleted or archived", es: "La publicación se borró o se archivó" },
    otro: { en: "Other reason", es: "Otro motivo" },
  };

  // Texto plano (las variables no se escapan: quien lo pone en HTML usa h()).
  function tx(k, vars) {
    var d = T[GP.idioma()] || T.en;
    var s = d[k] != null ? d[k] : (T.en[k] != null ? T.en[k] : k);
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, n) { return vars[n] != null ? String(vars[n]) : m; });
    return s;
  }
  function h(k, vars) { return esc(tx(k, vars)); }
  var num = GP.numero, fecha = GP.fecha;

  // ---------- estado ----------
  var TOKEN_RE = /^[A-Za-z0-9_-]{40}$/;
  var S = { vista: "cargando", correo: "", codigoPrueba: null, aviso: null, yo: null, tab: "productos", abierto: null, flash: null, ocupado: false, sincronizado: false,
    // 21-nov: filtro y orden de misiones, como en el club de Colombia (todas / sin producto / con el que ya tienes).
    filtroMis: { tipo: "todas", orden: "sugerido" } };
  var TABS = ["productos", "misiones", "canjear", "invitar", "historial"];
  try { var tGuardada = GP.leer("gp_tab"); if (TABS.indexOf(tGuardada) >= 0) S.tab = tGuardada; } catch (e) { /* nada */ }
  // El # manda sobre la pestaña guardada: los botones de los correos abren la que toca (#productos, #canjear…).
  try { var tHash = String(location.hash || "").replace(/^#/, ""); if (TABS.indexOf(tHash) >= 0) S.tab = tHash; } catch (e) { /* nada */ }

  function token() { var t = GP.leer("gp_token"); return t && TOKEN_RE.test(t) ? t : null; }

  function anunciar(texto) {
    if (!vivo) return;
    vivo.textContent = "";
    setTimeout(function () { vivo.textContent = texto; }, 60);
  }

  // ---------- llamadas con sesión ----------
  function api(ruta, cuerpo) {
    return GP.llamar(ruta, { token: token(), cuerpo: cuerpo }).then(function (r) {
      if (r._status === 401) { sesionVencida(r.error); throw { sesion: true }; }
      return r;
    });
  }
  function sesionVencida(msg) {
    GP.borrar("gp_token");
    S.yo = null;
    S.vista = "entrar";
    S.aviso = { tipo: "error", texto: msg || tx("vencida") };
    render();
  }

  function cargarYo(conservarScroll) {
    var y = window.scrollY;
    if (!S.yo) { S.vista = "cargando"; render(); }
    return api("/api/yo").then(function (r) {
      if (!r.ok) {
        S.vista = "error";
        S.aviso = { tipo: "error", texto: r.error };
        render();
        return;
      }
      // Idioma: si ella eligió uno en esta página y el del club es otro, se guarda en el Worker y se vuelve a pedir.
      var servidor = r.creadora && r.creadora.idioma === "es" ? "es" : "en";
      var local = GP.elegido();
      if (local && local !== servidor && !S.sincronizado) {
        S.sincronizado = true;
        return api("/api/idioma", { idioma: local }).then(function () { return cargarYo(conservarScroll); });
      }
      S.sincronizado = true;
      if (!local) GP.ponerIdioma(servidor, true);
      S.yo = r;
      S.vista = "inicio";
      render();
      if (conservarScroll) window.scrollTo(0, y);
    }).catch(function (e) { if (!e || !e.sesion) console.error(e); });
  }

  // ---------- piezas ----------
  function urlSegura(u) {
    var s = String(u || "");
    if (/^https:\/\//i.test(s) || /^\/[^/]/.test(s)) return s;
    if (GP.LOCAL && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(s)) return s;
    return null;
  }
  function urlGuia(transportista, guia) {
    if (!guia) return null;
    var t = String(transportista || "").toUpperCase(), g = encodeURIComponent(guia);
    if (/UPS/.test(t)) return "https://www.ups.com/track?tracknum=" + g;
    if (/USPS/.test(t)) return "https://tools.usps.com/go/TrackConfirmAction?tLabels=" + g;
    if (/FEDEX/.test(t)) return "https://www.fedex.com/fedextrack/?trknbr=" + g;
    if (/ONTRAC/.test(t)) return "https://www.ontrac.com/tracking/?number=" + g;
    return "https://track.amazon.com/tracking/" + g;
  }
  function estrellasTxt(n) { return num(n) + " " + (Math.abs(Number(n)) === 1 ? tx("estrella") : tx("estrellas")); }
  var ICO_PLAY = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';
  var ICO_FLECHA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function galeria(fotos, titulo, marca) {
    var lista = (fotos || []).map(urlSegura).filter(Boolean);
    if (!lista.length) return '<div class="gp-gal"><div class="gp-gtrack"><div class="gp-foto"><span>' + esc(marca || "") + "</span></div></div></div>";
    var m = lista.length;
    var html = '<div class="gp-gal"><div class="gp-gtrack" tabindex="0" role="group" aria-label="' + h("fotos_de", { titulo: titulo }) + '">';
    lista.forEach(function (u, k) {
      html += '<div class="gp-foto"><img src="' + esc(u) + '" alt="' + h("foto_n", { titulo: titulo, n: k + 1, m: m }) + '" loading="' + (k ? "lazy" : "eager") + '" decoding="async"></div>';
    });
    html += "</div>";
    if (m > 1) {
      html += '<button type="button" class="gp-gflecha gp-gflecha--ant" data-acc="foto" data-dir="-1" aria-label="' + h("foto_ant") + '">' + ICO_FLECHA + "</button>";
      html += '<button type="button" class="gp-gflecha gp-gflecha--sig" data-acc="foto" data-dir="1" aria-label="' + h("foto_sig") + '">' + ICO_FLECHA + "</button>";
      html += '<div class="gp-gpuntos" aria-hidden="true">';
      for (var k = 0; k < m; k++) html += '<i class="' + (k ? "" : "is-on") + '"></i>';
      html += "</div>";
    }
    return html + "</div>";
  }

  function botonRef(url) {
    var u = urlSegura(url);
    if (!u) return "";
    return '<p><a class="gp-btn-ref" href="' + esc(u) + '" target="_blank" rel="noopener">' + ICO_PLAY + h("ref_btn") + '</a><span class="gp-refnota">' + h("ref_nota") + "</span></p>";
  }

  // Campos de dirección de EE. UU. (pref = última dirección usada).
  function camposDireccion(pref, sufijo) {
    var y = S.yo, d = pref || {};
    var id = function (n) { return "d-" + n + "-" + sufijo; };
    var campo = function (n, etiqueta, attrs, valor, ayuda) {
      return '<div class="gp-f" data-campo="' + n + '"><label for="' + id(n) + '">' + etiqueta + "</label>" +
        '<input id="' + id(n) + '" name="' + n + '" type="text" ' + attrs + ' value="' + esc(valor || "") + '" aria-describedby="e' + id(n) + (ayuda ? " a" + id(n) : "") + '">' +
        (ayuda ? '<p class="gp-hint" id="a' + id(n) + '">' + ayuda + "</p>" : "") +
        '<p class="gp-err" id="e' + id(n) + '" role="alert"></p></div>';
    };
    var estados = y.estados_us || {};
    var ops = '<option value="">' + h("elige_estado") + "</option>";
    Object.keys(estados).sort(function (a, b) { return estados[a] < estados[b] ? -1 : 1; }).forEach(function (k) {
      ops += '<option value="' + esc(k) + '"' + (d.estado_us === k ? " selected" : "") + ">" + esc(estados[k]) + "</option>";
    });
    var nombre = d.nombre_envio || (y.creadora && y.creadora.nombre) || "";
    return '<fieldset class="gp-dir" style="border:0;margin:0;padding:0;display:grid;gap:12px;min-width:0"><legend class="gp-lbl" style="padding:0;margin-bottom:10px">' + h("dir_t") + "</legend>" +
      campo("nombre_envio", h("nombre_envio"), 'autocomplete="shipping name" maxlength="80"', nombre) +
      campo("linea1", h("linea1"), 'autocomplete="shipping address-line1" maxlength="120"', d.linea1) +
      campo("linea2", h("linea2") + ' <span class="gp-opc">' + h("opcional") + "</span>", 'autocomplete="shipping address-line2" maxlength="120"', d.linea2) +
      '<div class="gp-3">' + campo("ciudad", h("ciudad"), 'autocomplete="shipping address-level2" maxlength="60"', d.ciudad) +
      '<div class="gp-f" data-campo="estado_us"><label for="' + id("estado_us") + '">' + h("estado_us") + '</label><select id="' + id("estado_us") + '" name="estado_us" autocomplete="shipping address-level1" aria-describedby="e' + id("estado_us") + '">' + ops + '</select><p class="gp-err" id="e' + id("estado_us") + '" role="alert"></p></div></div>' +
      '<div class="gp-2">' + campo("zip", h("zip"), 'autocomplete="shipping postal-code" inputmode="numeric" maxlength="10"', d.zip) +
      campo("telefono", h("telefono") + ' <span class="gp-opc">' + h("opcional") + "</span>", 'autocomplete="shipping tel" inputmode="tel" maxlength="20"', d.telefono, h("tel_ayuda")).replace('type="text"', 'type="tel"') + "</div>" +
      '<p class="gp-small">' + h("dir_nota") + "</p></fieldset>";
  }
  function leerDireccion(form) {
    var o = {};
    ["nombre_envio", "linea1", "linea2", "ciudad", "estado_us", "zip", "telefono"].forEach(function (n) {
      var el = form.elements[n];
      o[n] = el ? String(el.value || "").trim() : "";
    });
    return o;
  }

  function formEnlace(tipo, id, actual, formato) {
    var fid = "enl-" + tipo + "-" + id;
    var etiqueta = actual ? tx("cambia_enlace") : tx("pega_enlace");
    return '<form class="gp-f" data-form="' + tipo + '" data-id="' + esc(id) + '" novalidate>' +
      '<label class="gp-lbl" for="' + fid + '">' + esc(etiqueta) + "</label>" +
      '<div class="gp-enlace"><input class="gp-input" id="' + fid + '" name="enlace" type="url" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="400" placeholder="https://www.instagram.com/reel/..." aria-describedby="e' + fid + '">' +
      '<button class="btn btn-dark btn-sm" type="submit">' + h("enviar_enlace") + "</button></div>" +
      (tipo === "mision" ? '<label class="gp-check-sm"><input type="checkbox" id="' + fid + '-cumple" name="cumple"><span>' + h(formato === "perfil" ? "cumple_bio" : "cumple") + "</span></label>" : "") +
      '<p class="gp-err" id="e' + fid + '" role="alert"></p></form>';
  }

  function cajaSpark(p) {
    var r = S.yo.reglas || {}, n = r.spark_estrellas || 50, dias = r.spark_min_dias || 60;
    if (p.spark_estado === "por_revisar") return '<div class="gp-caja gp-caja--ok"><h4>' + h("spark_revisando") + "</h4></div>";
    if (p.spark_estado === "valido") {
      return '<div class="gp-caja gp-caja--ok"><h4>' + h("spark_valido") + "</h4><p>" +
        (p.spark_vence ? h("spark_hasta", { fecha: fecha(p.spark_vence, true) }) + " " : "") +
        (p.estado === "publicado" ? h("bono_sumado", { n: n }) : h("bono_al_aprobar", { n: n })) + "</p></div>";
    }
    var fid = "spk-" + p.id;
    return '<div class="gp-caja"><h4>' + h("spark_t", { n: n }) + "</h4>" +
      (p.spark_estado === "no" ? '<p class="gp-devuelta">' + h("spark_no") + "</p>" : "") +
      "<p>" + h("spark_p", { dias: dias }) + "</p><ol>" +
      "<li>" + h("spark_1") + "</li><li>" + h("spark_2") + "</li><li>" + h("spark_3", { dias: dias }) + "</li><li>" + h("spark_4") + "</li></ol>" +
      '<form class="gp-f" data-form="spark" data-id="' + esc(p.id) + '" novalidate><label class="gp-lbl" for="' + fid + '">' + h("spark_codigo") + "</label>" +
      '<div class="gp-enlace"><input class="gp-input" id="' + fid + '" name="codigo" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="220" placeholder="#..." aria-describedby="e' + fid + '">' +
      '<button class="btn btn-dark btn-sm" type="submit">' + h("spark_enviar") + "</button></div>" +
      '<p class="gp-err" id="e' + fid + '" role="alert"></p></form></div>';
  }

  function cajaMeta(p) {
    var n = (S.yo.reglas || {}).meta_estrellas || 50;
    if (p.meta_estado === "dijo") return '<div class="gp-caja gp-caja--ok"><h4>' + h("meta_dijo") + "</h4></div>";
    if (p.meta_estado === "valido") {
      return '<div class="gp-caja gp-caja--ok"><h4>' + h("meta_valido") + "</h4><p>" +
        (p.estado === "publicado" ? h("bono_sumado", { n: n }) : h("bono_al_aprobar", { n: n })) + "</p></div>";
    }
    return '<div class="gp-caja"><h4>' + h("meta_t", { n: n }) + "</h4>" +
      (p.meta_estado === "no" ? '<p class="gp-devuelta">' + h("meta_no") + "</p>" : "") +
      "<p>" + h("meta_p") + "</p><ol><li>" + h("meta_1") + "</li><li>" + h("meta_2") + "</li><li>" + h("meta_3") + "</li><li>" + h("meta_4") + "</li></ol>" +
      '<div><button class="btn btn-line btn-sm" type="button" data-acc="meta" data-id="' + esc(p.id) + '">' + h("meta_btn") + '</button></div><p class="gp-err" id="emeta-' + esc(p.id) + '" role="alert"></p></div>';
  }

  // ---------- vistas ----------
  function vistaEntrar() {
    var a = S.aviso;
    return '<section class="gp-entrar" aria-labelledby="gp-e-t">' +
      '<div><p class="gp-kicker">BLONDZ PRO <span class="gp-star" aria-hidden="true">★</span></p><h1 id="gp-e-t">' + h("entrar_t") + "</h1></div>" +
      "<p>" + h("entrar_p") + "</p>" +
      '<form data-form="entrar" novalidate><div class="gp-f" data-campo="correo"><label for="gp-correo">' + h("correo") + "</label>" +
      '<input id="gp-correo" name="correo" type="email" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" maxlength="120" value="' + esc(S.correo) + '" aria-describedby="egp-correo" required>' +
      '<p class="gp-err" id="egp-correo" role="alert"></p></div>' +
      '<p class="gp-aviso gp-aviso--' + (a ? a.tipo : "error") + '" role="alert">' + (a ? esc(a.texto) : "") + "</p>" +
      '<button class="btn btn-primary" type="submit">' + h("enviar_codigo") + "</button></form>" +
      '<p class="gp-small">' + h("no_club") + ' <a class="link" href="/blondz-pro/#apply">' + h("postulate") + "</a></p></section>";
  }

  function vistaCodigo() {
    var a = S.aviso;
    return '<section class="gp-entrar" aria-labelledby="gp-c-t">' +
      '<div><p class="gp-kicker">BLONDZ PRO <span class="gp-star" aria-hidden="true">★</span></p><h1 id="gp-c-t">' + h("codigo_t") + "</h1></div>" +
      "<p>" + h("codigo_p", { correo: S.correo }) + "</p>" +
      (S.codigoPrueba ? '<p class="gp-aviso gp-aviso--info">' + h("codigo_prueba", { codigo: S.codigoPrueba }) + "</p>" : "") +
      '<form data-form="verificar" novalidate><div class="gp-f" data-campo="codigo"><label for="gp-codigo">' + h("codigo") + "</label>" +
      '<input class="gp-codigo" id="gp-codigo" name="codigo" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" maxlength="6" aria-describedby="egp-codigo" required>' +
      '<p class="gp-err" id="egp-codigo" role="alert"></p></div>' +
      '<p class="gp-aviso gp-aviso--' + (a ? a.tipo : "error") + '" role="alert">' + (a ? esc(a.texto) : "") + "</p>" +
      '<button class="btn btn-primary" type="submit">' + h("entrar_btn") + "</button></form>" +
      '<div class="gp-filas"><button class="gp-linkbtn" type="button" data-acc="reenviar">' + h("reenviar") + '</button><button class="gp-linkbtn" type="button" data-acc="otro-correo">' + h("otro_correo") + "</button></div></section>";
  }

  function vistaError() {
    return '<section class="gp-entrar"><h1>' + h("error_t") + '</h1><p class="gp-aviso gp-aviso--error" role="alert">' + esc(S.aviso ? S.aviso.texto : "") + "</p>" +
      '<button class="btn btn-primary" type="button" data-acc="reintentar">' + h("reintentar") + '</button><button class="gp-linkbtn" type="button" data-acc="salir">' + h("salir") + "</button></section>";
  }

  function cabecera() {
    var y = S.yo, p = y.puntos || {}, c = y.creadora || {};
    var primer = String(c.nombre || "").trim().split(/\s+/)[0] || "";
    var nivelNombre = GP.t(p.nivel_nombre) || p.nivel || "";
    var max = p.drops_mes || (y.drops_mes && y.drops_mes.max) || 1;
    var info = '<span class="gp-nivel"><span aria-hidden="true">★</span> ' + h("nivel") + ": " + esc(nivelNombre) + "</span>" +
      "<p>" + (max === 1 ? h("por_mes_1") : h("por_mes", { n: max })) + " · " + h("este_mes", { usados: (y.drops_mes || {}).usados || 0, max: max }) + "</p>";
    if (p.siguiente) {
      var niveles = (y.reglas && y.reglas.niveles) || [];
      var actual = niveles.filter(function (n) { return n.id === p.nivel; })[0];
      var desde = actual ? actual.desde : 0;
      var tramo = Math.max(1, p.siguiente.desde - desde);
      var pct = Math.max(0, Math.min(100, Math.round(((p.publicaciones || 0) - desde) / tramo * 100)));
      var sig = GP.t(p.siguiente.nombre);
      info += "<p>" + (p.siguiente.faltan === 1 ? h("faltan_1", { nivel: sig }) : h("faltan", { n: p.siguiente.faltan, nivel: sig })) +
        " (" + (p.siguiente.drops_mes === 1 ? h("por_mes_1") : h("por_mes", { n: p.siguiente.drops_mes })) + ")</p>" +
        '<div class="gp-barra" role="progressbar" aria-label="' + h("progreso") + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i style="width:' + pct + '%"></i></div>';
    } else {
      info += "<p>" + h("tope_nivel") + "</p>";
    }
    if (p.por_vencer > 0 && p.vence_el) {
      info += "<p>" + (p.por_vencer === 1 ? h("vencen_1", { fecha: fecha(p.vence_el) }) : h("vencen", { n: num(p.por_vencer), fecha: fecha(p.vence_el) })) +
        ' <a href="#panel-canjear" data-tab="canjear">' + h("canjealas") + "</a></p>";
    }
    return '<div class="gp-top"><div><p class="gp-kicker">My BLONDZ PRO <span class="gp-star" aria-hidden="true">★</span></p><h1>' + h("hola", { nombre: primer }) + "</h1></div>" +
      '<button class="gp-linkbtn" type="button" data-acc="salir">' + h("salir") + "</button></div>" +
      '<section class="gp-pts" aria-label="' + h("tu_saldo") + '"><p class="gp-pts-n">' + num(p.saldo || 0) + "<small>" + h("estrellas") + "</small></p>" +
      '<div class="gp-pts-info">' + info + "</div></section>";
  }

  function pestanas() {
    var html = '<div class="gp-tabs" role="tablist" aria-label="' + h("tabs") + '">';
    TABS.forEach(function (k) {
      var on = S.tab === k;
      html += '<button type="button" role="tab" id="tab-' + k + '" aria-controls="panel-' + k + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-tab="' + k + '">' + h("tab_" + k) + "</button>";
    });
    return html + "</div>";
  }

  function flash() {
    if (!S.flash) return "";
    // Se traduce al pintar: si ella cambia de idioma, el aviso cambia también.
    return '<p class="gp-aviso gp-aviso--' + S.flash.tipo + '" role="status" style="margin-top:20px">' + h(S.flash.clave, S.flash.vars) + "</p>";
  }

  function razonNoPedir() {
    var y = S.yo;
    if (y.falta_enlace && y.falta_enlace.length) return tx("no_pedir_enlace", { productos: y.falta_enlace.join(", ") });
    if (y.sin_publicar >= y.max_sin_publicar) return tx("no_pedir_sin_publicar", { n: y.sin_publicar });
    if (y.drops_mes && y.drops_mes.usados >= y.drops_mes.max) return tx("no_pedir_mes", { max: y.drops_mes.max });
    if (y.tope_anual && y.tope_anual.usado >= y.tope_anual.max) return tx("no_pedir_anual");
    return tx("no_pedir");
  }

  function tarjetaDrop(d) {
    var y = S.yo, abierto = S.abierto === "drop:" + d.id;
    var chips = '<span class="gp-chip">' + h("plazo", { n: d.plazo_dias || 15 }) + "</span>";
    if (d.cierra) chips += '<span class="gp-chip">' + h("abierto_hasta", { fecha: fecha(d.cierra) }) + "</span>";
    if (d.quedan > 0 && d.quedan <= 5 && !d.agotado) chips += '<span class="gp-chip gp-chip--poco">' + h("quedan", { n: d.quedan }) + "</span>";
    if (d.cantidad > 1) chips += '<span class="gp-chip">' + h("unidades", { n: d.cantidad }) + "</span>";
    var boton;
    if (d.ya_pedido) boton = '<button class="btn btn-line" type="button" disabled>' + h("ya_pedido") + "</button>";
    else if (d.agotado || d.quedan === 0) boton = '<button class="btn btn-line" type="button" disabled>' + h("agotado") + "</button>";
    else if (!y.puede_pedir) boton = '<button class="btn btn-line" type="button" disabled>' + h("no_disponible") + "</button>";
    else if (!abierto) boton = '<button class="btn btn-primary" type="button" data-acc="abrir" data-que="drop:' + esc(d.id) + '" aria-expanded="false">' + h("elegir") + "</button>";
    else boton = "";
    var lejos = !d.ya_pedido && (d.agotado || d.quedan === 0);
    return '<article class="gp-card' + (lejos ? " is-lejos" : "") + '" id="drop-' + esc(d.id) + '">' + galeria(d.imagenes && d.imagenes.length ? d.imagenes : [d.imagen], d.titulo, d.marca_nombre) +
      '<div class="gp-card-body"><p class="gp-marca">' + esc(d.marca_nombre) + "</p><h3>" + esc(d.titulo) + "</h3>" +
      (d.descripcion ? '<p class="gp-desc">' + esc(d.descripcion) + "</p>" : "") +
      (d.mision ? '<p class="gp-dato"><b>' + h("tu_mision") + "</b> " + esc(d.mision) + "</p>" : "") +
      '<p class="gp-dato"><b>' + h("etiqueta") + "</b> " + esc(d.etiquetas) + " + #ad</p>" +
      '<div class="gp-chipset">' + chips + "</div>" + botonRef(d.referencia) + "</div>" +
      (boton ? '<div class="gp-card-pie">' + boton + "</div>" : "") +
      (abierto ? formPedido(d) : "") + "</article>";
  }

  function formPedido(d) {
    var html = '<form class="gp-pedir" data-form="pedir" data-id="' + esc(d.id) + '" novalidate>';
    var ops = d.opciones || [];
    if (ops.length) {
      for (var u = 0; u < (d.cantidad || 1); u++) {
        html += '<fieldset class="gp-chips gp-f" data-campo="eleccion"><legend>' + (d.cantidad > 1 ? h("elige_tono_n", { n: u + 1 }) : h("elige_tono")) + "</legend>";
        var libres = ops.filter(function (o) { return !o.agotada; });
        ops.forEach(function (o) {
          var img = urlSegura(o.imagen);
          html += '<label><input type="radio" name="u' + u + '" value="' + o.ix + '"' + (o.agotada ? " disabled" : "") + (libres.length === 1 && !o.agotada ? " checked" : "") + "><span>" +
            (img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : "") + esc(o.nombre) + (o.agotada ? " <small>(" + h("agotada") + ")</small>" : "") + "</span></label>";
        });
        html += "</fieldset>";
      }
      html += '<p class="gp-err" id="eeleccion-' + esc(d.id) + '" data-err="eleccion" role="alert"></p>';
    }
    html += camposDireccion(S.yo.direccion, "drop" + d.id) +
      '<p class="gp-aviso gp-aviso--error" role="alert"></p>' +
      '<div class="gp-acciones"><button class="btn btn-primary" type="submit">' + h("confirmar_pedido") + '</button><button class="btn btn-line" type="button" data-acc="cerrar">' + h("cancelar") + "</button></div></form>";
    return html;
  }

  function filaPedido(p) {
    var e = p.estado, devuelto = e === "enviado" && p.devolucion;
    var etiqueta = devuelto ? tx("e_devuelto") : tx("e_" + e);
    var clase = devuelto ? "vencido" : e;
    var info = "";
    if (p.eleccion && p.eleccion.length) info += "<p><b>" + (p.eleccion.length > 1 ? h("tonos") : h("tono")) + "</b> " + esc(p.eleccion.join(", ")) + "</p>";
    info += "<p><b>" + h("pedido_el") + "</b> " + esc(fecha(p.creado_en, true)) + "</p>";
    if (["pedido", "aprobando", "aprobado", "enviado"].indexOf(e) >= 0 && p.direccion) info += "<p><b>" + h("envio_a") + "</b> " + esc(p.direccion) + "</p>";
    if (p.guia) {
      var u = urlGuia(p.transportista, p.guia);
      info += "<p><b>" + h("guia") + "</b> " + esc(p.transportista_nombre || p.transportista || "") + ' <a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(p.guia) + "</a></p>";
    }
    if (p.llega && (e === "enviado" || e === "aprobado")) info += "<p>" + h("llega", { fecha: fecha(p.llega) }) + "</p>";
    if (e === "pedido") info += "<p>" + h("t_pedido") + "</p>";
    if (e === "aprobando" || e === "aprobado") info += "<p>" + h("t_preparando") + "</p>";
    if (e === "enviado" || e === "vencido") {
      if (p.publicar_antes) info += "<p><b>" + h("publica_antes", { fecha: fecha(p.publicar_antes) }) + "</b></p>";
      if (p.mision) info += "<p><b>" + h("mision_l") + "</b> " + esc(p.mision) + "</p>";
      if (devuelto) info += '<p class="gp-devuelta"><b>' + h("t_devuelto") + "</b> " + esc(p.devolucion) + ". " + h("t_devuelto_2") + "</p>";
      else if (e === "vencido") info += '<p class="gp-devuelta">' + h("t_vencido") + "</p>";
      else info += "<p>" + h("t_enviado") + "</p>";
      info += botonRef(p.referencia);
    }
    if (e === "revisar") info += "<p>" + h("t_revisar") + "</p>";
    if (e === "publicado") info += "<p>" + h("t_publicado") + "</p>";
    if (e === "cancelado") info += "<p>" + h("t_cancelado") + "</p>";
    var enlace = urlSegura(p.enlace);
    if (enlace && (e === "revisar" || e === "publicado")) info += '<p><a href="' + esc(enlace) + '" target="_blank" rel="noopener">' + h("ver_publicacion") + "</a></p>";
    if (e === "enviado" || e === "vencido" || e === "revisar") info += formEnlace("publicacion", p.id, e === "revisar" ? p.enlace : null);
    if ((e === "revisar" || e === "publicado") && /tiktok\.com\//i.test(p.enlace || "")) info += cajaSpark(p);
    if ((e === "revisar" || e === "publicado") && /instagram\.com\//i.test(p.enlace || "")) info += cajaMeta(p);
    var img = urlSegura(p.imagen);
    return '<article class="gp-ped' + (img ? "" : " gp-ped--sola") + '" id="ped-' + esc(p.id) + '">' +
      (img ? '<div class="gp-foto"><img src="' + esc(img) + '" alt="" loading="lazy"></div>' : "") +
      '<div><span class="gp-estado gp-estado--' + esc(clase) + '">' + esc(etiqueta) + "</span><h3>" + esc(p.titulo || p.producto) + "</h3>" +
      '<div class="gp-ped-info">' + info + "</div></div></article>";
  }

  // Con un formulario abierto, las demás tarjetas de la rejilla no se estiran a su alto
  function claseAbierta(prefijo) { return S.abierto && S.abierto.indexOf(prefijo) === 0 ? " gp-grid--abierta" : ""; }

  function panelProductos() {
    var y = S.yo, drops = y.drops || [], peds = y.pedidos || [];
    var html = '<div class="gp-bloque" style="margin-top:24px"><h2>' + h("drops_t") + "</h2>" +
      '<div class="gp-guia"><strong>' + h("drops_guia_t") + "</strong><span>" + h("drops_guia") + "</span><span>" + h("reglas_guia") + "</span></div>";
    if (!y.puede_pedir && drops.length) html += '<p class="gp-aviso gp-aviso--info" style="margin-bottom:18px">' + esc(razonNoPedir()) + "</p>";
    html += drops.length ? '<div class="gp-grid' + claseAbierta("drop:") + '">' + drops.map(tarjetaDrop).join("") + "</div>" : '<p class="gp-vacio">' + h("sin_drops") + "</p>";
    html += '</div><div class="gp-bloque"><h2>' + h("mis_productos") + "</h2>";
    html += peds.length ? '<div class="gp-lista">' + peds.map(filaPedido).join("") + "</div>" : '<p class="gp-vacio">' + h("sin_pedidos") + "</p>";
    return html + "</div>";
  }

  function tarjetaMision(m) {
    var en = m.entrega, n = m.puntos;
    var chips = '<span class="gp-chip">' + esc(m.formato_nombre) + '</span><span class="gp-chip gp-chip--pts">+' + num(n) + ' <span aria-hidden="true">★</span><span class="visually-hidden">' + h("estrellas") + "</span></span>";
    chips += m.sin_producto ? '<span class="gp-chip gp-chip--sin">' + h("sin_producto") + "</span>" : '<span class="gp-chip">' + h("con_el_tuyo") + "</span>";
    if (m.cierra && m.abierta) chips += '<span class="gp-chip">' + h("hasta", { fecha: fecha(m.cierra) }) + "</span>";
    var estado = "";
    if (en) {
      if (en.estado === "aprobada") estado = '<p><span class="gp-estado gp-estado--aprobada">' + h("m_aprobada", { n: num(en.puntos || n) }) + "</span></p>";
      else if (en.estado === "rechazada") {
        var mot = MOTIVOS[en.motivo] ? GP.t(MOTIVOS[en.motivo]) : (en.motivo || "");
        estado = '<p class="gp-devuelta"><b>' + h("m_rechazada") + "</b> " + esc(mot) + (en.comentario ? ": " + esc(en.comentario) : "") + ". " + h("m_rechazada_2") + "</p>";
      } else estado = '<p><span class="gp-estado gp-estado--revisar">' + h("m_revisar") + "</span></p>";
      var u = urlSegura(en.enlace);
      if (u) estado += '<p class="gp-dato"><a href="' + esc(u) + '" target="_blank" rel="noopener">' + h("ver_publicacion") + "</a></p>";
    }
    var pie = "";
    if (en && en.estado === "aprobada") pie = "";
    else if (!m.abierta) pie = '<p class="gp-small">' + h("m_cerrada") + "</p>";
    else if (m.llena && !en) pie = '<p class="gp-small">' + h("m_llena") + "</p>";
    else pie = formEnlace("mision", m.id, en ? en.enlace : null, m.formato);
    var req = (m.requisitos || []).length ? '<p class="gp-dato"><b>' + h("requisitos") + '</b></p><ul class="gp-req-lista">' + m.requisitos.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" : "";
    return '<article class="gp-card' + (!m.abierta && !en ? " is-lejos" : "") + '" id="mis-' + esc(m.id) + '"><div class="gp-card-body"><p class="gp-marca">' + esc(m.marca_nombre) + "</p>" +
      '<div class="gp-chipset">' + chips + "</div><h3>" + esc(m.titulo) + "</h3>" + (m.brief ? '<p class="gp-desc">' + esc(m.brief) + "</p>" : "") + req +
      '<p class="gp-dato"><b>' + h("etiqueta") + "</b> " + esc(m.etiquetas) + (m.formato === "perfil" ? "" : " + #ad") + "</p>" + botonRef(m.referencia) + estado + "</div>" +
      (pie ? '<div class="gp-card-pie">' + pie + "</div>" : "") + "</article>";
  }

  // Primero lo que puede hacer (nuevas y devueltas), luego en revisión, aprobadas, y al final llenas o cerradas.
  function rangoMision(m) {
    var e = m.entrega;
    if (!e) return m.abierta && !m.llena ? 0 : 4;
    if (e.estado === "rechazada" && !m.abierta) return 4; // devuelta pero ya cerrada: no se puede reenviar
    return { rechazada: 1, revisar: 2, aprobada: 3 }[e.estado] || 4;
  }
  function deTipo(m, tipo) { return tipo === "todas" || (tipo === "sin" ? !!m.sin_producto : !m.sin_producto); }
  function filtrosMisiones(todas) {
    var f = S.filtroMis;
    var botones = [["todas", h("f_todas")], ["sin", h("sin_producto")], ["con", h("con_el_tuyo")]].map(function (o) {
      var n = todas.filter(function (m) { return deTipo(m, o[0]); }).length;
      return '<button class="gp-filtro" type="button" data-acc="fmis" data-tipo="' + o[0] + '" aria-pressed="' + (f.tipo === o[0]) + '">' + o[1] + " (" + num(n) + ")</button>";
    }).join("");
    var orden = '<label class="visually-hidden" for="gp-orden-mis">' + h("f_orden") + '</label><select class="gp-input gp-orden" id="gp-orden-mis" data-orden-mis>' +
      [["sugerido", "o_sugerido"], ["mas", "o_mas"], ["menos", "o_menos"]].map(function (o) {
        return '<option value="' + o[0] + '"' + (f.orden === o[0] ? " selected" : "") + ">" + h(o[1]) + "</option>";
      }).join("") + "</select>";
    return '<div class="gp-filtros" role="group" aria-label="' + h("misiones_t") + '"><div class="gp-filtros-b">' + botones + "</div>" + orden + "</div>";
  }

  function panelMisiones() {
    var todas = S.yo.misiones || [], f = S.filtroMis;
    var ms = todas.filter(function (m) { return deTipo(m, f.tipo); }).sort(function (a, b) {
      if (f.orden === "mas") return b.puntos - a.puntos || rangoMision(a) - rangoMision(b);
      if (f.orden === "menos") return a.puntos - b.puntos || rangoMision(a) - rangoMision(b);
      return rangoMision(a) - rangoMision(b) || b.puntos - a.puntos;
    });
    return '<div class="gp-bloque" style="margin-top:24px"><h2>' + h("misiones_t") + '</h2><div class="gp-guia"><span>' + h("misiones_guia") + "</span><span>" + h("reglas_guia") + "</span></div>" +
      (todas.length ? filtrosMisiones(todas) : "") +
      (ms.length ? '<div class="gp-grid">' + ms.map(tarjetaMision).join("") + "</div>" : '<p class="gp-vacio">' + h(todas.length ? "sin_filtro" : "sin_misiones") + "</p>") + "</div>";
  }

  function tarjetaRecompensa(r) {
    var saldo = (S.yo.puntos || {}).saldo || 0, abierto = S.abierto === "rec:" + r.id;
    var chips = '<span class="gp-chip gp-chip--pts">' + esc(estrellasTxt(r.puntos)) + "</span>";
    if (r.quedan != null && r.quedan > 0 && r.quedan <= 5 && !r.agotada) chips += '<span class="gp-chip gp-chip--poco">' + h("quedan", { n: r.quedan }) + "</span>";
    var boton = "";
    if (r.agotada) boton = '<button class="btn btn-line" type="button" disabled>' + h("agotado") + "</button>";
    else if (saldo < r.puntos) boton = '<button class="btn btn-line" type="button" disabled>' + (r.puntos - saldo === 1 ? h("te_faltan_1") : h("te_faltan", { n: num(r.puntos - saldo) })) + "</button>";
    else if (!abierto) boton = '<button class="btn btn-primary" type="button" data-acc="abrir" data-que="rec:' + esc(r.id) + '" aria-expanded="false">' + h("canjear_btn") + "</button>";
    var form = abierto ? '<form class="gp-pedir" data-form="canjear" data-id="' + esc(r.id) + '" novalidate><p class="gp-dato"><b>' + h("canje_resumen", { n: num(r.puntos), quedan: num(saldo - r.puntos) }) + "</b></p>" +
      camposDireccion(S.yo.direccion, "rec" + r.id) + '<p class="gp-aviso gp-aviso--error" role="alert"></p>' +
      '<div class="gp-acciones"><button class="btn btn-primary" type="submit">' + h("confirmar_canje") + '</button><button class="btn btn-line" type="button" data-acc="cerrar">' + h("cancelar") + "</button></div></form>" : "";
    return '<article class="gp-card' + (r.agotada || saldo < r.puntos ? " is-lejos" : "") + '" id="rec-' + esc(r.id) + '">' + galeria([r.imagen], r.titulo, r.marca_nombre) +
      '<div class="gp-card-body"><p class="gp-marca">' + esc(r.marca_nombre) + "</p><h3>" + esc(r.titulo) + '</h3><div class="gp-chipset">' + chips + "</div></div>" +
      (boton ? '<div class="gp-card-pie">' + boton + "</div>" : "") + form + "</article>";
  }

  function filaCanje(k) {
    var e = k.estado;
    var etiqueta = e === "pedido" ? tx("c_pedido") : tx("e_" + e);
    var info = "<p><b>" + h("pedido_el") + "</b> " + esc(fecha(k.creado_en, true)) + " · −" + esc(estrellasTxt(k.puntos)) + "</p>";
    if (k.guia) info += "<p><b>" + h("guia") + "</b> " + esc(k.transportista_nombre || k.transportista || "") + ' <a href="' + esc(urlGuia(k.transportista, k.guia)) + '" target="_blank" rel="noopener">' + esc(k.guia) + "</a></p>";
    if (k.llega && (e === "enviado" || e === "aprobado")) info += "<p>" + h("llega", { fecha: fecha(k.llega) }) + "</p>";
    if (e === "pedido") info += "<p>" + h("t_pedido") + "</p>";
    if (e === "aprobando" || e === "aprobado") info += "<p>" + h("t_preparando") + "</p>";
    if (e === "cancelado") info += "<p>" + h("c_cancelado") + "</p>";
    var img = urlSegura(k.imagen);
    return '<article class="gp-ped' + (img ? "" : " gp-ped--sola") + '">' + (img ? '<div class="gp-foto"><img src="' + esc(img) + '" alt="" loading="lazy"></div>' : "") +
      '<div><span class="gp-estado gp-estado--' + esc(e) + '">' + esc(etiqueta) + "</span><h3>" + esc(k.titulo) + '</h3><div class="gp-ped-info">' + info + "</div></div></article>";
  }

  function panelCanjear() {
    var y = S.yo, rs = y.recompensas || [], ks = y.canjes || [];
    return '<div class="gp-bloque" style="margin-top:24px"><h2>' + h("canjear_t") + '</h2><div class="gp-guia"><span>' + h("canjear_guia", { n: num((y.puntos || {}).saldo || 0) }) + "</span></div>" +
      (rs.length ? '<div class="gp-grid' + claseAbierta("rec:") + '">' + rs.map(tarjetaRecompensa).join("") + "</div>" : '<p class="gp-vacio">' + h("sin_recompensas") + "</p>") +
      '</div><div class="gp-bloque"><h2>' + h("mis_canjes") + "</h2>" +
      (ks.length ? '<div class="gp-lista">' + ks.map(filaCanje).join("") + "</div>" : '<p class="gp-vacio">' + h("sin_canjes") + "</p>") + "</div>";
  }

  function enlaceInvitacion(cod) { return location.origin + "/blondz-pro/?ref=" + encodeURIComponent(cod); }

  function panelInvitar() {
    var y = S.yo, cod = (y.creadora || {}).codigo, n = (y.reglas || {}).referida || 100;
    if (!cod) return '<div class="gp-bloque" style="margin-top:24px"><h2>' + h("invitar_t") + '</h2><p class="gp-vacio">' + h("sin_codigo") + "</p></div>";
    var link = enlaceInvitacion(cod);
    return '<div class="gp-bloque" style="margin-top:24px"><h2>' + h("invitar_t") + '</h2><div class="gp-invita">' +
      '<p class="gp-kicker">' + h("tu_codigo") + '</p><p class="gp-invita-cod">' + esc(cod) + "</p>" +
      "<p>" + h("invitar_p", { n: n }) + "</p>" +
      '<div class="gp-f"><label for="gp-link">' + h("tu_enlace") + '</label><input class="gp-input" id="gp-link" type="text" readonly value="' + esc(link) + '"></div>' +
      '<div class="gp-acciones"><button class="btn btn-primary" type="button" data-acc="copiar" data-valor="' + esc(link) + '">' + h("copiar_enlace") + "</button>" +
      '<button class="btn btn-line" type="button" data-acc="copiar" data-valor="' + esc(cod) + '">' + h("copiar_codigo") + "</button>" +
      (navigator.share ? '<button class="btn btn-line" type="button" data-acc="compartir" data-valor="' + esc(link) + '">' + h("compartir") + "</button>" : "") + "</div>" +
      '<p class="gp-small">' + h("invitar_req") + "</p></div></div>";
  }

  // Bono en efectivo por vistas: la regla (del servidor, con los valores de hoy por si falta) y los bonos de ella.
  function bloqueBono() {
    var r = (S.yo.reglas && S.yo.reglas.bono) || {}, bs = S.yo.bonos || [];
    var html = '<div class="gp-bloque gp-bono" style="margin-top:24px"><h2>' + h("bono_t") + '</h2><p class="gp-small">' +
      h("bono_p", { vistas: num(r.vistas || 20000), dias: num(r.dias || 30), usd: num(r.usd || 100) }) + "</p>";
    if (!bs.length) return html + '<p class="gp-vacio" style="margin-top:14px">' + h("bono_sin") + "</p></div>";
    html += '<div class="gp-movs" style="margin-top:14px">';
    bs.forEach(function (b) {
      var pagado = b.estado === "pagado";
      html += '<div class="gp-mov"><span>' + esc(b.titulo || "") + " · " + h("bono_vistas", { n: num(Number(b.vistas) || 0) }) + '</span><b class="' + (pagado ? "mas" : "") + '">US$' + num(Number(b.usd) || 0) +
        "</b><small>" + (pagado ? h("bono_pagado", { fecha: fecha(b.pagado_en, true) }) : h("bono_por_pagar", { fecha: fecha(b.creado_en, true) })) + "</small></div>";
    });
    return html + "</div></div>";
  }

  function panelHistorial() {
    var ms = S.yo.movimientos || [];
    var html = bloqueBono() + '<div class="gp-bloque" style="margin-top:24px"><h2>' + h("historial_t") + "</h2>";
    if (!ms.length) return html + '<p class="gp-vacio">' + h("sin_movs") + "</p></div>";
    html += '<div class="gp-movs">';
    ms.forEach(function (m) {
      var tipo = T.en["mv_" + m.tipo] ? tx("mv_" + m.tipo) : (m.tipo || "");
      var pts = Number(m.puntos) || 0;
      html += '<div class="gp-mov"><span>' + esc(tipo) + (m.detalle ? " · " + esc(m.detalle) : "") + '</span><b class="' + (pts >= 0 ? "mas" : "menos") + '">' + (pts >= 0 ? "+" : "−") + num(Math.abs(pts)) +
        '<span class="visually-hidden"> ' + h("estrellas") + "</span></b><small>" + esc(fecha(m.creado_en, true)) + "</small></div>";
    });
    return html + "</div></div>";
  }

  function buzon() {
    var ss = S.yo.sugerencias || [];
    var lista = ss.length ? '<div class="gp-ideas">' + ss.map(function (s) {
      return '<div class="gp-idea">' + esc(s.texto) + "<small>" + esc(fecha(s.creado_en, true)) + " · " + h("s_" + (T.en["s_" + s.estado] ? s.estado : "nueva")) + "</small>" +
        (s.respuesta ? '<p class="gp-resp"><b>' + h("respuesta") + "</b> " + esc(s.respuesta) + "</p>" : "") + "</div>";
    }).join("") + "</div>" : "";
    return '<section class="gp-bloque" aria-labelledby="gp-sug-t"><h2 id="gp-sug-t">' + h("buzon_t") + '</h2><div class="gp-buzon"><p class="gp-small">' + h("buzon_p") + "</p>" +
      '<form class="gp-f" data-form="sugerencia" novalidate><label class="visually-hidden" for="gp-sug">' + h("tu_idea") + "</label>" +
      '<textarea class="gp-input" id="gp-sug" name="texto" maxlength="500" rows="3" aria-describedby="egp-sug"></textarea><p class="gp-err" id="egp-sug" role="alert"></p>' +
      '<div><button class="btn btn-dark btn-sm" type="submit">' + h("enviar_idea") + "</button></div></form>" + lista + "</div>" +
      '<p class="gp-small" style="margin-top:22px">' + h("ayuda") + ' <a href="mailto:info@blondzonly.com">info@blondzonly.com</a></p></section>';
  }

  function vistaInicio() {
    var paneles = { productos: panelProductos, misiones: panelMisiones, canjear: panelCanjear, invitar: panelInvitar, historial: panelHistorial };
    return cabecera() + pestanas() +
      '<div class="gp-panel" role="tabpanel" id="panel-' + S.tab + '" aria-labelledby="tab-' + S.tab + '" tabindex="-1">' + flash() + paneles[S.tab]() + "</div>" + buzon();
  }

  // ---------- pintar (conserva lo escrito y el foco al cambiar de idioma) ----------
  function render() {
    var valores = {}, foco = document.activeElement && app.contains(document.activeElement) ? document.activeElement.id : null;
    Array.prototype.forEach.call(app.querySelectorAll("input[id], textarea[id], select[id]"), function (el) {
      if (el.type === "checkbox" || el.type === "radio") valores[el.id] = el.checked;
      else valores[el.id] = el.value;
    });
    var radios = {};
    Array.prototype.forEach.call(app.querySelectorAll("form[data-id] input[type=radio]:checked"), function (el) {
      radios[el.form.getAttribute("data-form") + ":" + el.form.getAttribute("data-id") + ":" + el.name] = el.value;
    });
    var vistas = { cargando: function () { return '<p class="gp-cargando" role="status">' + h("cargando") + "</p>"; }, entrar: vistaEntrar, codigo: vistaCodigo, error: vistaError, inicio: vistaInicio };
    app.innerHTML = (vistas[S.vista] || vistaEntrar)();
    Object.keys(valores).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el.readOnly) return;
      if (el.type === "checkbox" || el.type === "radio") el.checked = valores[id];
      else if (valores[id] !== "" || el.tagName === "SELECT") el.value = valores[id];
    });
    Object.keys(radios).forEach(function (k) {
      var p = k.split(":");
      var f = app.querySelector('form[data-form="' + p[0] + '"][data-id="' + p[1] + '"]');
      var r = f && f.querySelector('input[name="' + p[2] + '"][value="' + radios[k] + '"]');
      if (r && !r.disabled) r.checked = true;
    });
    if (foco && document.getElementById(foco)) { try { document.getElementById(foco).focus({ preventScroll: true }); } catch (e) { /* nada */ } }
    // En el celular las pestañas se desplazan de lado: la activa queda a la vista (sin scrollIntoView, que movería la página).
    var barra = app.querySelector(".gp-tabs"), activa = barra && barra.querySelector('[aria-selected="true"]');
    if (barra && activa && barra.scrollWidth > barra.clientWidth) {
      try {
        var rb = barra.getBoundingClientRect(), ra = activa.getBoundingClientRect();
        barra.scrollLeft = Math.max(0, barra.scrollLeft + (ra.left - rb.left) - (rb.width - ra.width) / 2);
      } catch (e) { /* nada */ }
    }
  }

  // ---------- errores en formularios ----------
  function limpiarForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll(".gp-err"), function (p) { p.textContent = ""; });
    Array.prototype.forEach.call(form.querySelectorAll(".is-error"), function (x) { x.classList.remove("is-error"); });
    Array.prototype.forEach.call(form.querySelectorAll('[aria-invalid="true"]'), function (x) { x.removeAttribute("aria-invalid"); });
    var a = form.querySelector(".gp-aviso");
    if (a) a.textContent = "";
  }
  function errorForm(form, r) {
    var primera = null;
    var errs = r.errores && typeof r.errores === "object" ? r.errores : {};
    Object.keys(errs).forEach(function (k) {
      var caja = form.querySelector('[data-campo="' + k + '"]');
      var p = form.querySelector('[data-err="' + k + '"]') || (caja && caja.querySelector(".gp-err"));
      if (p) p.textContent = String(errs[k]);
      if (caja) {
        caja.classList.add("is-error");
        var inp = caja.querySelector("input:not([type=radio]), select, textarea");
        if (inp) inp.setAttribute("aria-invalid", "true");
        primera = primera || caja;
      }
    });
    var aviso = form.querySelector(".gp-aviso");
    var texto = r.error || GP.t(GP.TXT_GENERAL);
    var repetido = Object.keys(errs).some(function (k) { return String(errs[k]) === texto; });
    if (aviso) aviso.textContent = repetido ? "" : texto;
    else if (!Object.keys(errs).length) { var p0 = form.querySelector(".gp-err"); if (p0) p0.textContent = texto; }
    var foco = primera ? primera.querySelector("input:not([disabled]), select, textarea") : null;
    if (foco) { try { foco.focus(); } catch (e) { /* nada */ } }
    else if (aviso) { try { aviso.scrollIntoView({ block: "center" }); } catch (e) { /* nada */ } }
  }
  function ocupar(form, si) {
    S.ocupado = si;
    Array.prototype.forEach.call(form.querySelectorAll("button"), function (b) { b.disabled = si; });
    if (si) form.setAttribute("aria-busy", "true"); else form.removeAttribute("aria-busy");
  }
  // clave de T (y sus variables): el aviso verde que queda arriba del panel.
  function listo(clave, vars, form) {
    if (form) { try { form.reset(); } catch (e) { /* nada */ } }
    S.flash = { tipo: "ok", clave: clave, vars: vars || null };
    S.abierto = null;
    anunciar(tx(clave, vars));
    return cargarYo(true);
  }
  var ENLACE_RE = /^https:\/\/([a-z0-9-]+\.)*(instagram\.com|tiktok\.com)\/\S+$/;

  // ---------- envíos ----------
  var envios = {
    entrar: function (form) {
      var correo = String(form.elements.correo.value || "").trim().toLowerCase();
      S.correo = correo;
      return GP.llamar("/api/entrar", { cuerpo: { correo: correo } }).then(function (r) {
        if (!r.ok) return errorForm(form, r);
        S.codigoPrueba = r.codigo_prueba || null;
        S.aviso = null;
        S.vista = "codigo";
        render();
        var c = document.getElementById("gp-codigo");
        if (c) c.focus();
      });
    },
    verificar: function (form) {
      var codigo = String(form.elements.codigo.value || "").replace(/\D/g, "");
      return GP.llamar("/api/verificar", { cuerpo: { correo: S.correo, codigo: codigo } }).then(function (r) {
        if (!r.ok || !r.token) return errorForm(form, r.ok ? { error: GP.t(GP.TXT_GENERAL) } : r);
        GP.guardar("gp_token", r.token);
        S.codigoPrueba = null;
        S.aviso = null;
        S.sincronizado = false;
        S.yo = null;
        return cargarYo().then(function () { var h1 = app.querySelector("h1"); if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus(); } });
      });
    },
    pedir: function (form) {
      var id = form.getAttribute("data-id");
      var d = (S.yo.drops || []).filter(function (x) { return String(x.id) === id; })[0];
      if (!d) return Promise.resolve();
      var eleccion = [];
      if ((d.opciones || []).length) {
        for (var u = 0; u < (d.cantidad || 1); u++) {
          var r0 = form.querySelector('input[name="u' + u + '"]:checked');
          if (!r0) return Promise.resolve(errorForm(form, { error: tx("sin_tono"), errores: { eleccion: tx("sin_tono") } }));
          eleccion.push(Number(r0.value));
        }
      }
      var cuerpo = leerDireccion(form);
      cuerpo.drop_id = d.id;
      cuerpo.eleccion = eleccion;
      return api("/api/pedir", cuerpo).then(function (r) { return r.ok ? listo("pedido_ok", null, form) : errorForm(form, r); });
    },
    canjear: function (form) {
      var cuerpo = leerDireccion(form);
      cuerpo.recompensa_id = form.getAttribute("data-id");
      return api("/api/canjear", cuerpo).then(function (r) { return r.ok ? listo("canje_ok", null, form) : errorForm(form, r); });
    },
    publicacion: function (form) {
      var enlace = String(form.elements.enlace.value || "").trim();
      if (!ENLACE_RE.test(enlace)) return Promise.resolve(errorForm(form, { error: tx("enlace_malo") }));
      return api("/api/publicacion", { pedido_id: form.getAttribute("data-id"), enlace: enlace }).then(function (r) { return r.ok ? listo("enlace_ok", null, form) : errorForm(form, r); });
    },
    mision: function (form) {
      var enlace = String(form.elements.enlace.value || "").trim();
      if (!ENLACE_RE.test(enlace)) return Promise.resolve(errorForm(form, { error: tx("enlace_malo") }));
      if (!form.elements.cumple.checked) return Promise.resolve(errorForm(form, { error: tx("cumple_falta") }));
      return api("/api/mision", { mision_id: form.getAttribute("data-id"), enlace: enlace }).then(function (r) { return r.ok ? listo("mision_ok", null, form) : errorForm(form, r); });
    },
    spark: function (form) {
      var codigo = String(form.elements.codigo.value || "").replace(/\s+/g, "");
      if (!/^#[A-Za-z0-9+/=_-]{20,200}$/.test(codigo)) return Promise.resolve(errorForm(form, { error: tx("spark_malo") }));
      var n = (S.yo.reglas || {}).spark_estrellas || 50;
      return api("/api/spark", { pedido_id: form.getAttribute("data-id"), codigo: codigo }).then(function (r) {
        if (!r.ok) return errorForm(form, r);
        if (r.estado !== "valido") return listo("spark_ok_revisar", null, form);
        return r.sumadas ? listo("spark_ok_suma", { n: r.sumadas }, form) : listo("spark_ok", { n: n }, form);
      });
    },
    sugerencia: function (form) {
      var texto = String(form.elements.texto.value || "").trim();
      if (texto.length < 5) return Promise.resolve(errorForm(form, { error: tx("idea_corta") }));
      return api("/api/sugerencia", { texto: texto }).then(function (r) {
        if (!r.ok) return errorForm(form, r);
        form.elements.texto.value = "";
        return listo("idea_ok");
      });
    },
  };

  app.addEventListener("submit", function (ev) {
    var form = ev.target;
    var tipo = form.getAttribute("data-form");
    if (!envios[tipo]) return;
    ev.preventDefault();
    if (S.ocupado) return;
    limpiarForm(form);
    ocupar(form, true);
    Promise.resolve().then(function () { return envios[tipo](form); }).catch(function (e) {
      if (e && e.sesion) return;
      console.error(e);
      errorForm(form, { error: GP.t(GP.TXT_GENERAL) });
    }).then(function () { if (document.contains(form)) ocupar(form, false); else S.ocupado = false; });
  });

  // ---------- clics ----------
  function irATab(k, enfocarTab) {
    if (TABS.indexOf(k) < 0) return;
    S.tab = k;
    S.flash = null;
    S.abierto = null;
    GP.guardar("gp_tab", k);
    try { if (location.hash !== "#" + k) history.replaceState(null, "", "#" + k); } catch (e) { /* nada */ }
    render();
    if (enfocarTab) { var b = document.getElementById("tab-" + k); if (b) b.focus(); }
  }
  window.addEventListener("hashchange", function () {
    var k = String(location.hash || "").replace(/^#/, "");
    if (S.vista === "inicio" && TABS.indexOf(k) >= 0 && k !== S.tab) irATab(k);
  });
  function copiar(valor) {
    var ok = function () { anunciar(tx("copiado")); mostrarCopiado(); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(valor).then(ok, function () { copiarViejo(valor) ? ok() : window.prompt("", valor); });
    } else if (copiarViejo(valor)) ok();
    else window.prompt("", valor);
  }
  function copiarViejo(valor) {
    var t = document.createElement("textarea");
    t.value = valor;
    t.setAttribute("readonly", "");
    t.style.position = "fixed";
    t.style.opacity = "0";
    document.body.appendChild(t);
    t.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(t);
    return ok;
  }
  var botonCopiado = null;
  function mostrarCopiado() {
    if (!botonCopiado) return;
    var b = botonCopiado, antes = b.textContent;
    b.textContent = tx("copiado");
    setTimeout(function () { if (document.contains(b)) b.textContent = antes; }, 1600);
  }

  app.addEventListener("click", function (ev) {
    var tab = ev.target.closest("[data-tab]");
    if (tab) { ev.preventDefault(); irATab(tab.getAttribute("data-tab"), tab.getAttribute("role") === "tab"); return; }
    var b = ev.target.closest("[data-acc]");
    if (!b) return;
    var acc = b.getAttribute("data-acc");
    if (acc === "foto") {
      var track = b.parentNode.querySelector(".gp-gtrack");
      track.scrollBy({ left: Number(b.getAttribute("data-dir")) * track.clientWidth, behavior: "smooth" });
    } else if (acc === "fmis") {
      S.filtroMis.tipo = b.getAttribute("data-tipo");
      render();
      var otra = app.querySelector('[data-acc="fmis"][data-tipo="' + S.filtroMis.tipo + '"]');
      if (otra) otra.focus();
    } else if (acc === "abrir") {
      S.abierto = b.getAttribute("data-que");
      S.flash = null;
      render();
      var card = document.getElementById((S.abierto.indexOf("drop:") === 0 ? "drop-" : "rec-") + S.abierto.split(":")[1]);
      var primero = card && card.querySelector(".gp-pedir input:not([disabled]), .gp-pedir select");
      if (primero) { try { primero.focus({ preventScroll: true }); } catch (e) { primero.focus(); } }
      if (card) { var f = card.querySelector(".gp-pedir"); if (f) try { f.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) { /* nada */ } }
    } else if (acc === "cerrar") {
      var q = S.abierto;
      S.abierto = null;
      render();
      var vuelta = q && app.querySelector('[data-que="' + q + '"]');
      if (vuelta) vuelta.focus();
    } else if (acc === "meta") {
      if (S.ocupado) return;
      S.ocupado = true;
      b.disabled = true;
      var id = b.getAttribute("data-id");
      api("/api/meta", { pedido_id: id }).then(function (r) {
        S.ocupado = false;
        if (r.ok) return listo("meta_ok", { n: (S.yo.reglas || {}).meta_estrellas || 50 });
        b.disabled = false;
        var p = document.getElementById("emeta-" + id);
        if (p) p.textContent = r.error;
      }).catch(function () { S.ocupado = false; });
    } else if (acc === "copiar") {
      botonCopiado = b;
      copiar(b.getAttribute("data-valor"));
    } else if (acc === "compartir") {
      try { navigator.share({ title: "BLONDZ PRO", text: tx("compartir_texto"), url: b.getAttribute("data-valor") }).catch(function () { /* cancelado */ }); } catch (e) { copiar(b.getAttribute("data-valor")); }
    } else if (acc === "salir") {
      var t = token();
      GP.borrar("gp_token");
      S.yo = null;
      S.vista = "entrar";
      S.aviso = null;
      S.flash = null;
      render();
      if (t) GP.llamar("/api/salir", { token: t, cuerpo: {} });
    } else if (acc === "reintentar") {
      cargarYo();
    } else if (acc === "otro-correo") {
      S.vista = "entrar";
      S.aviso = null;
      S.codigoPrueba = null;
      render();
      var c = document.getElementById("gp-correo");
      if (c) c.focus();
    } else if (acc === "reenviar") {
      b.disabled = true;
      GP.llamar("/api/entrar", { cuerpo: { correo: S.correo } }).then(function (r) {
        S.aviso = r.ok ? { tipo: "ok", texto: tx("reenviado") } : { tipo: "error", texto: r.error };
        if (r.ok) S.codigoPrueba = r.codigo_prueba || null;
        render();
      });
    }
  });

  // Orden de misiones (el select conserva el foco al volver a pintar: render() guarda el foco por id).
  app.addEventListener("change", function (ev) {
    var t = ev.target;
    if (!t || !t.hasAttribute || !t.hasAttribute("data-orden-mis")) return;
    S.filtroMis.orden = t.value;
    render();
  });

  // Pestañas con flechas (patrón ARIA de tabs).
  app.addEventListener("keydown", function (ev) {
    var t = ev.target;
    if (!t || t.getAttribute("role") !== "tab") return;
    var i = TABS.indexOf(t.getAttribute("data-tab")), j = -1;
    if (ev.key === "ArrowRight") j = (i + 1) % TABS.length;
    else if (ev.key === "ArrowLeft") j = (i - 1 + TABS.length) % TABS.length;
    else if (ev.key === "Home") j = 0;
    else if (ev.key === "End") j = TABS.length - 1;
    if (j < 0) return;
    ev.preventDefault();
    irATab(TABS[j], true);
  });

  // Puntos de la galería (scroll no burbujea: se escucha en captura).
  app.addEventListener("scroll", function (ev) {
    var t = ev.target;
    if (!t.classList || !t.classList.contains("gp-gtrack")) return;
    var i = Math.round(t.scrollLeft / Math.max(1, t.clientWidth));
    var puntos = t.parentNode.querySelectorAll(".gp-gpuntos i");
    for (var k = 0; k < puntos.length; k++) puntos[k].classList.toggle("is-on", k === i);
  }, true);

  // ---------- idioma ----------
  GP.alCambiarIdioma(function (i, recordar) {
    // el último aviso para lectores de pantalla quedó en el idioma anterior: se limpia
    if (vivo) vivo.textContent = "";
    render();
    if (recordar && S.vista === "inicio" && token()) {
      api("/api/idioma", { idioma: i }).then(function (r) { if (r.ok) cargarYo(true); }).catch(function () { /* 401 ya manejado */ });
    }
  });

  // ---------- arranque ----------
  if (token()) cargarYo();
  else { S.vista = "entrar"; render(); }
})();
