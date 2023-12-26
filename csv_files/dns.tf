
resource "google_dns_record_set" "admin-api" {
  name         = "${var.admin-api}.${var.domain}"
  type         = var.record_type_A
  ttl          = var.ttl
  managed_zone = var.managed_zone
  rrdatas      = var.static_ip_external_gw_global
  project      = var.domain_project
}

resource "google_dns_record_set" "agency-api" {
  name         = "${var.agency-api}.${var.domain}"
  type         = var.record_type_A
  ttl          = var.ttl
  managed_zone = var.managed_zone
  rrdatas      = var.static_ip_external_gw_global
  project      = var.domain_project
}

resource "google_dns_record_set" "agency-data-api" {
  name         = "${var.agency-data-api}.${var.domain}"
  type         = var.record_type_A
  ttl          = var.ttl
  managed_zone = var.managed_zone
  rrdatas      = var.static_ip_external_gw_global
  project      = var.domain_project
}
        
