
// @if ENV='DEV'
<script type="text/javascript" src="http://local.tui.de:9001/assets/js/tui.js/* @echo MS */"></script>
// @endif


// @if ENV='PROD'
    <script type="text/javascript" src="/assets/js/tui.min.js"></script>
// @endif