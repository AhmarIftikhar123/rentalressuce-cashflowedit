<?php
// ── Email to lead ─────────────────────────────────────────────────────────────
function rental_audit_email_lead( $name, $email, $audit ) {

    $upside  = number_format( $audit['upside']   ?? 0 );
    $ltr     = number_format( $audit['baseLTR']  ?? 0 );
    $mtr     = number_format( $audit['baseMTR']  ?? 0 );
    $str     = number_format( $audit['baseSTR']  ?? 0 );
    $piti    = number_format( $audit['piti']     ?? 0 );
    $ltr_cf  = number_format( $audit['ltr_cf']   ?? 0 );
    $str_cf  = number_format( $audit['str_cf']   ?? 0 );
    $val     = number_format( $audit['val']      ?? 0 );
    $balance = number_format( $audit['loanBalance'] ?? 0 );
    $equity  = number_format( $audit['equity']   ?? 0 );
    $eq_pct  = $audit['equityPct'] ?? 0;
    $goal    = $audit['goal']      ?? 'not specified';

    $subject = "Your Rental Rescue Cashflow Audit — +\${$upside}/mo upside";

    $body = "Hi {$name},

Here's your personalised Rental Rescue Cashflow Audit.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MONTHLY UPSIDE POTENTIAL
  +\${$upside}/mo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CURRENT PERFORMANCE
  LTR market rent:       \${$ltr}/mo
  Monthly payment (PITI):\${$piti}/mo
  LTR cash flow:         \${$ltr_cf}/mo

OPTIMIZED POTENTIAL
  Mid-term (MTR) income: \${$mtr}/mo
  Short-term (STR) income:\${$str}/mo
  STR cash flow:         \${$str_cf}/mo

EQUITY POSITION
  Property value:        \${$val}
  Loan balance:          \${$balance}
  Estimated equity:      \${$equity} ({$eq_pct}%)

YOUR GOAL: {$goal}

We'll follow up shortly with your full strategy plan and exact next steps.

— The Rental Rescue Team
" . get_site_url();

    $headers = [ 'Content-Type: text/plain; charset=UTF-8' ];
    wp_mail( $email, $subject, $body, $headers );
}


// ── Email to admin ────────────────────────────────────────────────────────────
function rental_audit_email_admin( $name, $email, $phone, $audit ) {

    $admin   = get_option( 'admin_email' );
    $upside  = number_format( $audit['upside']   ?? 0 );
    $eq_pct  = $audit['equityPct'] ?? 0;
    $goal    = $audit['goal']      ?? '—';
    $val     = number_format( $audit['val']      ?? 0 );

    $subject = "New Audit Lead: {$name} — +\${$upside}/mo";

    $body = "New Rental Rescue lead submitted.

Name:           {$name}
Email:          {$email}
Phone:          {$phone}

Property value: \${$val}
Monthly upside: +\${$upside}/mo
Equity:         {$eq_pct}%
Goal:           {$goal}
";

    wp_mail( $admin, $subject, $body );
}
