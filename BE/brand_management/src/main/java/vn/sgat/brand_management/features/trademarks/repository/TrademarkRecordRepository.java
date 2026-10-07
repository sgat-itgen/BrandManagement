package vn.sgat.brand_management.features.trademarks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import vn.sgat.brand_management.features.trademarks.domain.TrademarkRecord;

public interface TrademarkRecordRepository extends JpaRepository<TrademarkRecord, Long>, JpaSpecificationExecutor<TrademarkRecord> {}
